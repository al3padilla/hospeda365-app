import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { COLORES, conAlfa } from "../constants/colors";
import { useAuth } from "../contexto/AuthContext";
import { useResponsive } from "../hooks/useResponsive";
import type { DatosRegistro } from "../servicios/tiposAuth";
import {
  fuerzaPassword,
  sinErrores,
  validarRegistro,
  type ErroresCampo,
} from "../validacion/auth";
import BannerError from "./BannerError";
import CampoAuth from "./CampoAuth";
import TarjetaFormulario from "./TarjetaFormulario";
import Boton from "./ui/Boton";
import Texto from "./ui/Texto";
import { estilosFormularioRegistro as styles } from "../estilos/cuenta";

const DATOS_VACIOS: DatosRegistro = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  password: "",
  confirmPassword: "",
};

const NIVELES = [
  { texto: "", color: conAlfa(COLORES.sea, 0.15), textoColor: COLORES.mist },
  { texto: "Débil", color: "#EF4444", textoColor: COLORES.rojo },
  { texto: "Media", color: COLORES.coral, textoColor: COLORES.coral },
  { texto: "Fuerte", color: "#10B981", textoColor: COLORES.verde },
] as const;

export default function FormularioRegistro() {
  const router = useRouter();
  const { esSm } = useResponsive();
  const { registrar, estaCargando, error, limpiarError } = useAuth();

  const [datos, setDatos] = useState<DatosRegistro>(DATOS_VACIOS);
  const [errores, setErrores] = useState<ErroresCampo<DatosRegistro>>({});
  /** La validación en vivo empieza tras el primer envío. */
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  function actualizar(campo: keyof DatosRegistro, valor: string) {
    const nuevos = { ...datos, [campo]: valor };
    setDatos(nuevos);

    if (intentoEnvio) setErrores(validarRegistro(nuevos));
    if (error) limpiarError();
  }

  async function handleSubmit() {
    if (estaCargando) return;

    setIntentoEnvio(true);

    const nuevosErrores = validarRegistro(datos);
    setErrores(nuevosErrores);
    if (!sinErrores(nuevosErrores)) return;

    const ok = await registrar(datos);
    if (ok) router.replace("/perfil");
  }

  const nivel = fuerzaPassword(datos.password);
  const info = NIVELES[nivel];

  return (
    <TarjetaFormulario
      titulo="Crear cuenta"
      descripcion="Regístrate para reservar habitaciones en Hotel Terra Azul."
      anchoMaximo={512}
    >
      {error ? (
        <View style={styles.banner}>
          <BannerError mensaje={error.mensaje} onCerrar={limpiarError} />
        </View>
      ) : null}

      <View style={styles.campos}>
        <View style={[{ gap: 16 }, esSm && { flexDirection: "row" }]}>
          <View style={esSm ? styles.flex : undefined}>
            <CampoAuth
              label="Nombre"
              icono="persona"
              autoComplete="given-name"
              textContentType="givenName"
              placeholder="Jason"
              value={datos.nombre}
              onChangeText={(v) => actualizar("nombre", v)}
              error={errores.nombre}
              disabled={estaCargando}
            />
          </View>
          <View style={esSm ? styles.flex : undefined}>
            <CampoAuth
              label="Apellido"
              icono="persona"
              autoComplete="family-name"
              textContentType="familyName"
              placeholder="Sosa"
              value={datos.apellido}
              onChangeText={(v) => actualizar("apellido", v)}
              error={errores.apellido}
              disabled={estaCargando}
            />
          </View>
        </View>

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
        />

        <CampoAuth
          label="Teléfono"
          icono="telefono"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          placeholder="7123 4567"
          value={datos.telefono}
          onChangeText={(v) => actualizar("telefono", v)}
          error={errores.telefono}
          disabled={estaCargando}
        />

        <View>
          <CampoAuth
            label="Contraseña"
            icono="llave"
            esPassword
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            placeholder="Mínimo 8 caracteres"
            value={datos.password}
            onChangeText={(v) => actualizar("password", v)}
            error={errores.password}
            disabled={estaCargando}
          />

          {datos.password.length > 0 ? (
            <View style={styles.fuerza}>
              <View style={styles.barras}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[styles.barra, { backgroundColor: i <= nivel ? info.color : conAlfa(COLORES.sea, 0.15) }]}
                  />
                ))}
              </View>
              <Texto peso="semi" color={info.textoColor} tamano={11}>
                {info.texto}
              </Texto>
            </View>
          ) : null}
        </View>

        <CampoAuth
          label="Confirmar contraseña"
          icono="llave"
          esPassword
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="Repite tu contraseña"
          value={datos.confirmPassword}
          onChangeText={(v) => actualizar("confirmPassword", v)}
          error={errores.confirmPassword}
          disabled={estaCargando}
          returnKeyType="go"
          onSubmitEditing={() => void handleSubmit()}
        />

        <Boton
          texto="Registrarme"
          icono="personaMas"
          cargando={estaCargando}
          textoCargando="Creando cuenta…"
          onPress={() => void handleSubmit()}
          style={styles.botonEnviar}
        />
      </View>

      <View style={styles.pie}>
        <Texto color={COLORES.mist} tamano={14}>
          ¿Ya tienes cuenta?{" "}
        </Texto>
        <Pressable onPress={() => router.replace("/login")} hitSlop={8}>
          <Texto peso="semi" color={COLORES.sea} tamano={14}>
            Inicia sesión
          </Texto>
        </Pressable>
      </View>
    </TarjetaFormulario>
  );
}
