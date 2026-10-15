import { useEffect, useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { COLORES, conAlfa } from "../constants/colors";
import {
  DIAS_SEMANA,
  MESES,
  formatFechaCorta,
  parseIso,
  sameDay,
  startOfDay,
  toIsoLocal,
} from "../datos/fechas";
import HojaModal from "./HojaModal";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosDatePicker as styles } from "../estilos/inicio";

type DatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  icon?: ReactNode;
  placeholder?: string;
};

export default function DatePicker({
  label,
  value,
  onChange,
  min,
  icon,
  placeholder = "Selecciona una fecha",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseIso(value);
  const minDate = parseIso(min ?? "");
  const [view, setView] = useState<Date>(() => parseIso(value) ?? parseIso(min ?? "") ?? new Date());

  useEffect(() => {
    const s = parseIso(value);
    if (s) setView(s);
  }, [value]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = startOfDay(new Date());

  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));

  function isDisabled(date: Date): boolean {
    if (!minDate) return false;
    return startOfDay(date) < startOfDay(minDate);
  }

  function pick(date: Date) {
    if (isDisabled(date)) return;
    onChange(toIsoLocal(date));
    setOpen(false);
  }

  const display = selected ? formatFechaCorta(value) : placeholder;

  return (
    <View style={styles.contenedorCampo}>
      <View style={styles.etiqueta}>
        {icon}
        <Texto peso="semi" color={COLORES.mist} tamano={12} style={styles.etiquetaTexto}>
          {label}
        </Texto>
      </View>

      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display}`}
        style={({ pressed }) => [styles.campo, pressed && { borderColor: conAlfa(COLORES.sea, 0.3) }]}
      >
        <Texto color={selected ? COLORES.sea : COLORES.mist} tamano={15}>
          {display}
        </Texto>
        <Icono nombre="calendario" tamano={16} color={COLORES.coral} />
      </Pressable>

      <HojaModal
        visible={open}
        onClose={() => setOpen(false)}
        anchoMaximo={360}
        inferiorEnMovil={false}
        etiqueta={`Calendario ${label}`}
      >
        <View style={styles.calendario}>
          <View style={styles.cabecera}>
            <Pressable
              onPress={() => setView(new Date(year, month - 1, 1))}
              accessibilityLabel="Mes anterior"
              hitSlop={8}
              style={styles.flecha}
            >
              <Icono nombre="chevronIzq" tamano={18} />
            </Pressable>
            <Texto peso="display" color={COLORES.sea} tamano={17}>
              {MESES[month]} {year}
            </Texto>
            <Pressable
              onPress={() => setView(new Date(year, month + 1, 1))}
              accessibilityLabel="Mes siguiente"
              hitSlop={8}
              style={styles.flecha}
            >
              <Icono nombre="chevronDer" tamano={18} />
            </Pressable>
          </View>

          <View style={styles.semana}>
            {DIAS_SEMANA.map((d) => (
              <View key={d} style={styles.celda}>
                <Texto peso="semi" color={COLORES.mist} tamano={11} style={styles.diaSemana}>
                  {d}
                </Texto>
              </View>
            ))}
          </View>

          <View style={styles.semana}>
            {cells.map((date, i) => {
              if (!date) return <View key={`e-${i}`} style={styles.celda} />;

              const disabled = isDisabled(date);
              const isSelected = selected ? sameDay(date, selected) : false;
              const isToday = sameDay(date, today);

              return (
                <View key={toIsoLocal(date)} style={styles.celda}>
                  <Pressable
                    disabled={disabled}
                    onPress={() => pick(date)}
                    accessibilityRole="button"
                    accessibilityLabel={formatFechaCorta(toIsoLocal(date))}
                    accessibilityState={{ selected: isSelected, disabled }}
                    style={[
                      styles.dia,
                      isSelected
                        ? { backgroundColor: COLORES.coral }
                        : isToday
                          ? { backgroundColor: conAlfa(COLORES.sea, 0.1) }
                          : null,
                      disabled && { opacity: 0.3 },
                    ]}
                  >
                    <Texto
                      peso={isSelected || isToday ? "semi" : "regular"}
                      color={isSelected ? COLORES.foam : COLORES.sea}
                      tamano={14}
                    >
                      {date.getDate()}
                    </Texto>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <View style={styles.pie}>
            <Pressable
              onPress={() => {
                onChange("");
                setOpen(false);
              }}
              hitSlop={8}
            >
              <Texto peso="medio" color={COLORES.mist} tamano={13}>
                Borrar
              </Texto>
            </Pressable>
            <Pressable
              onPress={() => {
                if (!isDisabled(today)) {
                  onChange(toIsoLocal(today));
                  setView(today);
                  setOpen(false);
                }
              }}
              hitSlop={8}
            >
              <Texto peso="semi" color={COLORES.coral} tamano={13}>
                Hoy
              </Texto>
            </Pressable>
          </View>
        </View>
      </HojaModal>
    </View>
  );
}
