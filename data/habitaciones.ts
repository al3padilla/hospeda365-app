
import type { ImageSourcePropType } from "react-native";

export type Habitacion = {
  id: string;
  nombre: string;
  imagen: ImageSourcePropType;
};

export const habitaciones: Habitacion[] = [
  {
    id: "basica",
    nombre: "Habitación Básica",
    imagen: require("../assets/images/Hbasica.jpg"),
  },
  {
    id: "intermedia",
    nombre: "Habitación Intermedia",
    imagen: require("../assets/images/Hintermedia.jpg"),
  },
  {
    id: "familiar",
    nombre: "Habitación Familiar",
    imagen: require("../assets/images/Hfamiliar.jpg"),
  },
  {
    id: "kids",
    nombre: "Habitación Kids",
    imagen: require("../assets/images/Hkids.jpg"),
  },
  {
    id: "vip",
    nombre: "Habitación VIP",
    imagen: require("../assets/images/Hvip.jpg"),
  },
  {
    id: "platinum",
    nombre: "Habitación Platinum",
    imagen: require("../assets/images/Hsuiteslujo.jpg"),
  },
];
