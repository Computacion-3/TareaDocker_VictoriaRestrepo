import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useApiData } from "../../hooks/useApiData";
import { createUser, getRoles, getUserById, updateUser } from "../../services/adminService";
import type { Role } from "../../types/admin";
import type { User } from "../../types/user";
import { AdminUserForm } from "./components/AdminForms";
import AdminPage from "./components/AdminPage";

interface AdminUserFormPageProps {
  mode: "create" | "edit";
  targetRoleName: "USER" | "TRAINER";
}

interface FormData {
  roles: Role[];
  user?: User;
}

function AdminUserFormPage({ mode, targetRoleName }: AdminUserFormPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isTrainer = targetRoleName === "TRAINER";
  const backTo = isTrainer ? "/admin/trainers" : "/admin/users";
  const entityName = isTrainer ? "entrenador" : "usuario";

  const loadFormData = useCallback(async (): Promise<FormData> => {
    const roles = await getRoles();
    if (mode === "edit" && id) {
      const user = await getUserById(Number(id));
      return { roles, user };
    }

    return { roles };
  }, [id, mode]);

  const { data, error, loading } = useApiData(loadFormData, "No pudimos cargar la informacion necesaria.");

  return (
    <AdminPage
      title={mode === "create" ? `Nuevo ${entityName}` : `Editar ${entityName}`}
      subtitle={isTrainer ? "Actualiza el equipo entrenador." : "Actualiza participantes de bienestar."}
    >
      {loading && <LoadingSpinner label="Cargando informacion" />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <AdminUserForm
          initialUser={data.user}
          roles={data.roles}
          targetRoleName={targetRoleName}
          title={mode === "create" ? `Crear ${entityName}` : `Actualizar ${entityName}`}
          submitLabel={mode === "create" ? "Crear" : "Guardar cambios"}
          successMessage={mode === "create" ? "Registro creado correctamente." : "Registro actualizado correctamente."}
          onSubmit={async (payload) => {
            if (mode === "edit" && id) {
              await updateUser(Number(id), payload);
            } else {
              await createUser(payload);
            }
            void navigate(backTo);
          }}
        />
      )}
    </AdminPage>
  );
}

export default AdminUserFormPage;
