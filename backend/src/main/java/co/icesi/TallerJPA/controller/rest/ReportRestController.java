package co.icesi.TallerJPA.controller.rest;

import co.icesi.TallerJPA.services.ReportService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportRestController {

    private final ReportService reportService;

    public ReportRestController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/progress/me/pdf")
    public ResponseEntity<byte[]> myProgressPdf() {
        return pdfResponse(reportService.generateMyProgressReport(), "progress-report-me.pdf");
    }

    @GetMapping("/users/{userId}/progress/pdf")
    public ResponseEntity<byte[]> userProgressPdf(@PathVariable Long userId) {
        return pdfResponse(reportService.generateProgressReport(userId), "progress-report-" + userId + ".pdf");
    }

    private ResponseEntity<byte[]> pdfResponse(byte[] pdf, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
        headers.setContentLength(pdf.length);
        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}
