import { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import { COLORES, conAlfa } from "../constants/colors";
import Icono, { type NombreIcono } from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosCampoAuth as styles } from "../estilos/cuenta";
import { AUTH_LIMITS } from '../utils/authValidation';

type CampoAuthProps = Omit<TextInputProps, "style" | "editable"> & {
  label: string;
  error?: string;
  /** Icono a la izquierda de la etiqueta. */
  icono?: NombreIcono;
  /** Muestra el botón de ojo para revelar la contraseña. */
  esPassword?: boolean;
  disabled?: boolean;
};

/** Campo de texto de los formularios de autenticación. */
export default function CampoAuth({
  label,
  error,
  icono,
  esPassword = false,
  disabled = false,
  ...props
}: CampoAuthProps) {
  const [visible, setVisible] = useState(false);
  const [enfocado, setEnfocado] = useState(false);
  const hayError = Boolean(error);

  const colorBorde = hayError
    ? "#F87171"
    : enfocado
      ? COLORES.coral
      : conAlfa(COLORES.sea, 0.15);

  return (
    <View>
      <View style={styles.etiqueta}>
        {icono ? <Icono nombre={icono} tamano={14} color={COLORES.mist} /> : null}
        <Texto peso="semi" color={COLORES.mist} tamano={12} style={styles.etiquetaTexto}>
          {label}
        </Texto>
      </View>

      <View>
        <TextInput
          {...props}
          maxLength={props.maxLength ?? (esPassword ? AUTH_LIMITS.password : props.keyboardType === 'email-address' ? AUTH_LIMITS.email : props.keyboardType === 'phone-pad' ? AUTH_LIMITS.phone : AUTH_LIMITS.name)}
          autoCorrect={false}
          editable={!disabled}
          secureTextEntry={esPassword && !visible}
          placeholderTextColor={conAlfa(COLORES.mist, 0.6)}
          accessibilityLabel={label}
          accessibilityHint={error}
          onFocus={(e) => {
            setEnfocado(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setEnfocado(false);
            props.onBlur?.(e);
          }}
          style={[
            styles.input,
            { borderColor: colorBorde },
            esPassword && { paddingRight: 44 },
            disabled && { opacity: 0.6 },
          ]}
        />

        {esPassword ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            accessibilityLabel={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            accessibilityRole="button"
            style={styles.ojo}
            hitSlop={6}
          >
            <Icono nombre={visible ? "ojoOff" : "ojo"} tamano={18} color={COLORES.mist} />
          </Pressable>
        ) : null}
      </View>

      {hayError ? (
        <Texto accessibilityLiveRegion="polite" color={COLORES.rojo} tamano={12} style={styles.textoError}>
          {error}
        </Texto>
      ) : null}
    </View>
  );
}
