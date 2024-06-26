import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

export function Anuncios() {
  const { width, height } = Dimensions.get("screen");

  return (
    <TouchableOpacity style={styles.container}>
      <LinearGradient
        colors={["#025940", "#03A66A"]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: -0 }}
        style={[styles.anuncio]}
      >
        <View style={[styles.containerTextoAnuncio]}>
          <Text style={[styles.textoTituloAnuncio]}>CONSULTA MARCADA</Text>
          <Text style={[styles.textoDescricaoAnuncio]}>DATA: 00/00/0000</Text>
          <Text style={[styles.textoDescricaoAnuncio]}>HORÁRIO: 00:00:00</Text>
          <Text style={[styles.textoDescricaoAnuncio]}>
            MÉDICO: DR. MÉDICO MEDICINA
          </Text>
          <Text style={[styles.textoDescricaoAnuncio]}>
            TIPO: TIPO CONSULTA
          </Text>
          <Text style={[styles.textoDescricaoAnuncio]}>
            USUÁRIO: USUÁRIO TITULAR
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
