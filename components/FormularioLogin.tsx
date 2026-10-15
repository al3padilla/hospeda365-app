import { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { COLORES } from "../constants/colors";
import { useAuth } from "../contexto/AuthContext";
import type { Credenciales } from "../servicios/tiposAuth";
import { vibrarError, vibrarExito } from "../utilidades/hapticos";
import { sinErrores, validarLogin, type ErroresCampo } from "../validacion/auth";
import BannerError from "./BannerError";
import CampoAuth from "./CampoAuth";
import TarjetaFormulario from "./TarjetaFormulario";
import Boton from "./ui/Boton";
import Texto from "./ui/Texto";
import { estilosFormularioLogin as styles } from "../estilos/cuenta";

export default function FormularioLogin() {
  const router = useRouter();
  const { login, estaAutenticado, usuario, estaCargando, error, limpiarError } = useAuth();

  const [datos, setDatos] = useState<Credenciales>({ email: "", password: "" });
  const [errores, setErrores] = useState<ErroresCampo<Credenciales>>({});

  // También redirige tras un login exitoso, cuando el Context actualiza `usuario`.
  useEffect(() => {
    if (estaAutenticado && usuario) {
      vibrarExito();
      router.replace("/perfil");
    }
  }, [estaAutenticado, usuario, router]);

  useEffect(() => {
    if (error) vibrarError();
  }, [error]);

  function actualizar(campo: keyof Credenciales, valor: string) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));

    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }));
    if (error) limpiarError();
  }

  async function handleSubmit() {
    if (estaCargando) return;

    const nuevosErrores = validarLogin(datos);
    setErrores(nuevosErrores);
    if (!sinErrores(nuevosErrores)) return;

    await login({ email: datos.email.trim(), password: datos.password });
  }

  return (
    <TarjetaFormulario
      titulo="Iniciar sesión"
      descripcion="Accede para ver tus reservas y gestionar tu estancia."
      anchoMaximo={448}
    >
      {error ? (
        <View style={styles.banner}>
          <BannerError mensaje={error.mensaje} onCerrar={limpiarError} />
        </View>
      ) : null}

      <View style={styles.campos}>
        <CampoAuth
          label="Correo electrónico"
          icono="arroba"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          placeholder="tu@correo.com"
          value={datos.email}
          onChangeText={(v) => actualizar("email", v)}
          error={errores.email}
          disabled={estaCargando}
          returnKeyType="next"
        />

        <CampoAuth
          label="Contraseña"
          icono="llave"
          esPassword
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          placeholder="••••••••"
          value={datos.password}
          onChangeText={(v) => actualizar("password", v)}
          error={errores.password}
          disabled={estaCargando}
          returnKeyType="go"
          onSubmitEditing={() => void handleSubmit()}
        />

        <Boton
          texto="Entrar"
          icono="entrar"
          cargando={estaCargando}
          textoCargando="Entrando…"
          onPress={() => void handleSubmit()}
          style={styles.botonEnviar}
        />
      </View>

      <View style={styles.separador}>
        <View style={styles.linea} />
        <Texto color={COLORES.mist} tamano={12}>
          o
        </Texto>
        <View style={styles.linea} />
      </View>

      <Boton texto="Crear una cuenta" variante="borde" onPress={() => router.push("/registro")} />
    </TarjetaFormulario>
  );
}
