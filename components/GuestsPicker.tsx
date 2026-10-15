import { useState } from "react";
import { Pressable, View } from "react-native";
import { COLORES } from "../constants/colors";
import HojaModal from "./HojaModal";
import Boton from "./ui/Boton";
import Icono, { type NombreIcono } from "./ui/Icono";
import Texto from "./ui/Texto";
import { pluralizar } from "../datos/texto";
import { estilosGuestsPicker as styles } from "../estilos/inicio";

export type Huespedes = {
  adultos: number;
  ninos: number;
  bebes: number;
};

type GuestsPickerProps = {
  value: Huespedes;
  onChange: (value: Huespedes) => void;
};

function totalHuespedes(h: Huespedes): number {
  return h.adultos + h.ninos + h.bebes;
}

/** Total que cuenta para capacidad de habitación (adultos + niños). */
export function totalParaCapacidad(h: Huespedes): number {
  return Math.max(1, h.adultos + h.ninos);
}

export function resumenHuespedes(h: Huespedes): string {
  const partes: string[] = [];
  partes.push(pluralizar(h.adultos, "adulto"));
  if (h.ninos > 0) partes.push(pluralizar(h.ninos, "niño"));
  if (h.bebes > 0) partes.push(pluralizar(h.bebes, "bebé"));
  return partes.join(", ");
}

type FilaProps = {
  label: string;
  hint: string;
  icono: NombreIcono;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
};

function BotonContador({
  icono,
  etiqueta,
  deshabilitado,
  onPress,
}: {
  icono: NombreIcono;
  etiqueta: string;
  deshabilitado: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      style={[styles.botonContador, deshabilitado && { opacity: 0.35 }]}
    >
      <Icono nombre={icono} tamano={16} />
    </Pressable>
  );
}

function FilaContador({ label, hint, icono, value, min, max, onChange }: FilaProps) {
  return (
    <View style={styles.fila}>
      <View style={styles.filaEtiqueta}>
        <Icono nombre={icono} tamano={16} color={COLORES.coral} style={styles.iconoEtiqueta} />
        <View>
          <Texto peso="semi" color={COLORES.sea} tamano={14}>
            {label}
          </Texto>
          <Texto color={COLORES.mist} tamano={12}>
            {hint}
          </Texto>
        </View>
      </View>
      <View style={styles.controles}>
        <BotonContador
          icono="menos"
          etiqueta={`Menos ${label}`}
          deshabilitado={value <= min}
          onPress={() => onChange(Math.max(min, value - 1))}
        />
        <Texto peso="semi" color={COLORES.sea} tamano={14} style={styles.contador}>
          {value}
        </Texto>
        <BotonContador
          icono="mas"
          etiqueta={`Más ${label}`}
          deshabilitado={value >= max}
          onPress={() => onChange(Math.min(max, value + 1))}
        />
      </View>
    </View>
  );
}

export default function GuestsPicker({ value, onChange }: GuestsPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.contenedorCampo}>
      <View style={styles.etiquetaCampo}>
        <Icono nombre="personas" tamano={14} color={COLORES.mist} />
        <Texto peso="semi" color={COLORES.mist} tamano={12} style={styles.etiqueta}>
          Personas
        </Texto>
      </View>

      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Huéspedes: ${resumenHuespedes(value)}`}
        style={styles.campo}
      >
        <Texto color={COLORES.sea} tamano={14} numberOfLines={1} style={styles.resumen}>
          {resumenHuespedes(value)}
        </Texto>
        <View style={styles.total}>
          <Texto peso="semi" color={COLORES.sea} tamano={12}>
            {totalHuespedes(value)}
          </Texto>
        </View>
      </Pressable>

      <HojaModal visible={open} onClose={() => setOpen(false)} anchoMaximo={340} etiqueta="Seleccionar huéspedes">
        <View style={styles.hoja}>
          <FilaContador
            label="Adultos"
            hint="Desde 13 años"
            icono="persona"
            value={value.adultos}
            min={1}
            max={10}
            onChange={(adultos) => onChange({ ...value, adultos })}
          />
          <FilaContador
            label="Niños"
            hint="2 a 12 años"
            icono="personas"
            value={value.ninos}
            min={0}
            max={8}
            onChange={(ninos) => onChange({ ...value, ninos })}
          />
          <FilaContador
            label="Bebés"
            hint="Menores de 2 años"
            icono="bebe"
            value={value.bebes}
            min={0}
            max={4}
            onChange={(bebes) => onChange({ ...value, bebes })}
          />
          <Boton texto="Listo" tamano="sm" onPress={() => setOpen(false)} style={styles.botonListo} />
        </View>
      </HojaModal>
    </View>
  );
}
