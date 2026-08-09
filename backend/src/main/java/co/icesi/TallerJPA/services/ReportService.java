package co.icesi.TallerJPA.services;

import co.icesi.TallerJPA.dto.response.HistoryEntryDTO;
import co.icesi.TallerJPA.dto.response.HistoryResponseDTO;
import co.icesi.TallerJPA.dto.response.HistorySummaryDTO;
import co.icesi.TallerJPA.dto.response.StatsResponseDTO;
import co.icesi.TallerJPA.exception.ResourceNotFoundException;
import co.icesi.TallerJPA.model.Recommendation;
import co.icesi.TallerJPA.model.Routine;
import co.icesi.TallerJPA.model.RoutineExercise;
import co.icesi.TallerJPA.model.User;
import co.icesi.TallerJPA.repository.RecommendationRepository;
import co.icesi.TallerJPA.repository.RoutineRepository;
import co.icesi.TallerJPA.repository.UserRepository;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private final AuthContextService authContextService;
    private final HistoryService historyService;
    private final StatsService statsService;
    private final UserRepository userRepository;
    private final RoutineRepository routineRepository;
    private final RecommendationRepository recommendationRepository;

    public ReportService(
            AuthContextService authContextService,
            HistoryService historyService,
            StatsService statsService,
            UserRepository userRepository,
            RoutineRepository routineRepository,
            RecommendationRepository recommendationRepository
    ) {
        this.authContextService = authContextService;
        this.historyService = historyService;
        this.statsService = statsService;
        this.userRepository = userRepository;
        this.routineRepository = routineRepository;
        this.recommendationRepository = recommendationRepository;
    }

    public byte[] generateMyProgressReport() {
        return generateProgressReport(authContextService.currentUser().getId());
    }

    public byte[] generateProgressReport(Long userId) {
        authContextService.requireSelfTrainerAssignedOrAdmin(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        HistoryResponseDTO history = historyService.findByUserForCurrent(userId);
        StatsResponseDTO weeklyStats = statsService.weeklyForUser(userId);
        StatsResponseDTO monthlyStats = statsService.monthlyForUser(userId);
        List<Routine> routines = routineRepository.findByOwnerId(userId);
        List<Recommendation> recommendations = recommendationRepository.findByTargetUserId(userId);

        return buildPdf(user, history, weeklyStats, monthlyStats, routines, recommendations);
    }

    private byte[] buildPdf(
            User user,
            HistoryResponseDTO history,
            StatsResponseDTO weeklyStats,
            StatsResponseDTO monthlyStats,
            List<Routine> routines,
            List<Recommendation> recommendations
    ) {
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, output);
            document.open();

            addTitle(document);
            addUserInfo(document, user);
            addSummary(document, history.getSummary(), routines);
            addStats(document, weeklyStats, monthlyStats);
            addProgressTable(document, history.getEntries());
            addRoutines(document, routines);
            addRecommendations(document, recommendations);
            addFooter(document);

            document.close();
            return output.toByteArray();
        } catch (DocumentException exception) {
            throw new IllegalStateException("Could not generate progress PDF", exception);
        }
    }

    private void addTitle(Document document) throws DocumentException {
        Paragraph title = new Paragraph("Reporte personal de progreso", font(18, true));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(14);
        document.add(title);
    }

    private void addUserInfo(Document document, User user) throws DocumentException {
        document.add(section("Informacion del usuario"));
        PdfPTable table = table(2);
        addRow(table, "Nombre", user.getName());
        addRow(table, "Email", user.getEmail());
        addRow(table, "Rol", user.getRole() == null ? "N/A" : user.getRole().getName());
        addRow(table, "Fecha de generacion", LocalDateTime.now().toString());
        document.add(table);
    }

    private void addSummary(Document document, HistorySummaryDTO summary, List<Routine> routines) throws DocumentException {
        document.add(section("Resumen general"));
        PdfPTable table = table(2);
        addRow(table, "Registros de progreso", value(summary.getTotalProgressEntries()));
        addRow(table, "Total minutos", value(summary.getTotalMinutes()));
        addRow(table, "Total repeticiones", value(summary.getTotalRepetitions()));
        addRow(table, "Promedio de esfuerzo", value(summary.getAverageEffortLevel()));
        addRow(table, "Ultima actividad", value(summary.getLastActivityDate()));
        addRow(table, "Rutinas activas", value(summary.getActiveRoutineCount()));
        addRow(table, "Rutinas asociadas", value(routines.size()));
        addRow(table, "Rutinas con progreso", value(summary.getCompletedRoutineCount()));
        document.add(table);
    }

    private void addStats(Document document, StatsResponseDTO weeklyStats, StatsResponseDTO monthlyStats) throws DocumentException {
        document.add(section("Estadisticas"));
        PdfPTable table = table(5);
        addHeader(table, "Periodo");
        addHeader(table, "Registros");
        addHeader(table, "Minutos");
        addHeader(table, "Repeticiones");
        addHeader(table, "Esfuerzo prom.");
        addCells(table, "Semanal", value(weeklyStats.getTotalProgressEntries()), value(weeklyStats.getTotalMinutes()),
                value(weeklyStats.getTotalRepetitions()), value(weeklyStats.getAverageEffortLevel()));
        addCells(table, "Mensual", value(monthlyStats.getTotalProgressEntries()), value(monthlyStats.getTotalMinutes()),
                value(monthlyStats.getTotalRepetitions()), value(monthlyStats.getAverageEffortLevel()));
        document.add(table);
    }

    private void addProgressTable(Document document, List<HistoryEntryDTO> entries) throws DocumentException {
        document.add(section("Progreso reciente"));
        if (entries == null || entries.isEmpty()) {
            document.add(new Paragraph("No hay registros de progreso disponibles para este periodo.", font(10, false)));
            return;
        }

        PdfPTable table = table(8);
        addHeader(table, "Fecha");
        addHeader(table, "Periodo");
        addHeader(table, "Rutina");
        addHeader(table, "Ejercicio");
        addHeader(table, "Reps");
        addHeader(table, "Min");
        addHeader(table, "Esfuerzo");
        addHeader(table, "Notas");

        entries.stream().limit(12).forEach(entry -> addCells(table,
                value(entry.getDate()),
                value(entry.getPeriodType()),
                value(entry.getRoutineName()),
                value(entry.getExerciseName()),
                value(entry.getRepetitions()),
                value(entry.getTimeMinutes()),
                value(entry.getEffortLevel()),
                value(entry.getNotes())
        ));
        document.add(table);
    }

    private void addRoutines(Document document, List<Routine> routines) throws DocumentException {
        document.add(section("Rutinas asociadas"));
        if (routines == null || routines.isEmpty()) {
            document.add(new Paragraph("No hay rutinas asociadas.", font(10, false)));
            return;
        }

        for (Routine routine : routines.stream().limit(8).toList()) {
            document.add(new Paragraph(routine.getName() + " - " + value(routine.getDescription()), font(10, true)));
            String exercises = routine.getRoutineExercises() == null
                    ? "Sin ejercicios"
                    : routine.getRoutineExercises().stream()
                            .sorted(Comparator.comparing(RoutineExercise::getOrderIndex, Comparator.nullsLast(Integer::compareTo)))
                            .map(routineExercise -> routineExercise.getExercise() == null ? "Ejercicio" : routineExercise.getExercise().getName())
                            .reduce((left, right) -> left + ", " + right)
                            .orElse("Sin ejercicios");
            document.add(new Paragraph("Tipo: " + (routine.isPredefined() ? "Predisenada" : "Propia") + ". Ejercicios: " + exercises, font(9, false)));
        }
    }

    private void addRecommendations(Document document, List<Recommendation> recommendations) throws DocumentException {
        document.add(section("Recomendaciones recibidas"));
        if (recommendations == null || recommendations.isEmpty()) {
            document.add(new Paragraph("No hay recomendaciones registradas.", font(10, false)));
            return;
        }

        PdfPTable table = table(4);
        addHeader(table, "Fecha");
        addHeader(table, "Entrenador");
        addHeader(table, "Titulo");
        addHeader(table, "Mensaje");
        recommendations.stream().limit(8).forEach(recommendation -> addCells(table,
                value(recommendation.getCreatedAt()),
                recommendation.getTrainer() == null ? "N/A" : recommendation.getTrainer().getName(),
                value(recommendation.getTitle()),
                value(recommendation.getMessage())
        ));
        document.add(table);
    }

    private void addFooter(Document document) throws DocumentException {
        Paragraph footer = new Paragraph("Universidad Icesi - Plataforma de actividad fisica", font(9, false));
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(18);
        document.add(footer);
    }

    private Paragraph section(String title) {
        Paragraph paragraph = new Paragraph(title, font(13, true));
        paragraph.setSpacingBefore(10);
        paragraph.setSpacingAfter(6);
        return paragraph;
    }

    private PdfPTable table(int columns) {
        PdfPTable table = new PdfPTable(columns);
        table.setWidthPercentage(100);
        table.setSpacingAfter(8);
        return table;
    }

    private void addRow(PdfPTable table, String label, String value) {
        addHeader(table, label);
        table.addCell(cell(value));
    }

    private void addHeader(PdfPTable table, String text) {
        PdfPCell cell = cell(text);
        cell.setBackgroundColor(new Color(230, 230, 230));
        cell.setPhrase(new Phrase(text, font(9, true)));
        table.addCell(cell);
    }

    private void addCells(PdfPTable table, String... values) {
        for (String text : values) {
            table.addCell(cell(text));
        }
    }

    private PdfPCell cell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(value(text), font(8, false)));
        cell.setPadding(4);
        return cell;
    }

    private Font font(int size, boolean bold) {
        return FontFactory.getFont(FontFactory.HELVETICA, size, bold ? Font.BOLD : Font.NORMAL);
    }

    private String value(Object value) {
        return value == null ? "N/A" : String.valueOf(value);
    }
}
