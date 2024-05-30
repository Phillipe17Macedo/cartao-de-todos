import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { HeaderConsulta } from "@/components/Consulta/HeaderConsulta/Header";
import { SearchBar } from "../components/Consulta/SearchBar/SearchBar";
import Especialidade from "@/components/Consulta/DropDownEspecialidade/Especialidade";
import Medico from "@/components/Consulta/DropDownMedico/Medico";
import CalendarioConsulta from "../components/Consulta/CalendarioConsulta/CalendarioConsulta";
import HorarioConsulta from "../components/Consulta/HorarioConsulta/HorarioConsulta";
import ConfirmacaoConsulta from "@/components/Consulta/ConfirmacaoConsulta/ConfirmacaoConsulta";
import { buscarUsuarioPorCPF } from "@/connection/buscarUsuarioPorCPF";
import { buscarAreas } from "../connection/buscarAreas";
import { styles } from "../styles/StylesServicosPage/StylesConsultaPage/styles";
import { salvarConsulta } from "@/connection/salvarConsulta";

export default function Consulta() {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [cpfUsuario, setCpfUsuario] = useState<string | null>();
  const [especialidadeId, setEspecialidadeId] = useState<string | null>(null);
  const [especialidadeNome, setEspecialidadeNome] = useState<string | null>(null);
  const [medico, setMedico] = useState<any | null>(null);
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);
  const [resultadoPesquisa, setResultadoPesquisa] = useState<any[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [calendarioVisivel, setCalendarioVisivel] = useState(false);
  const [horarioVisivel, setHorarioVisivel] = useState(false);
  const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);
  const [dataConsulta, setDataConsulta] = useState<string | null>(null);
  const [horarioConsulta, setHorarioConsulta] = useState<string | null>(null);
  const [consulta, setConsulta] = useState({
    usuario: "Phillipe Ferreira Macedo", 
    especialidade: "",
    medico: "",
    data: "",
    horario: "",
  });

  useEffect(() => {
    async function fetchUsuarioLogado() {
      try {
        if (cpfUsuario) {
          const usuarioLogado = await buscarUsuarioPorCPF(cpfUsuario);
          setUsuario(usuarioLogado.nome);
          setConsulta((prev) => ({
            ...prev,
            usuario: usuarioLogado.nome, // Definir o nome do usuário logado na consulta
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
      }
    }

    fetchUsuarioLogado();
  }, [cpfUsuario]);

  const handlePesquisar = async (query: string) => {
    try {
      const results = await buscarAreas(query);
      setResultadoPesquisa(results);
      setModalVisivel(true);
    } catch (error) {
      console.error("Erro ao realizar pesquisa:", error);
    }
  };

  const handleSugestoes = async (query: string) => {
    try {
      const results = await buscarAreas(query);
      setResultadoPesquisa(results);
    } catch (error) {
      console.error("Erro ao obter sugestões:", error);
    }
  };

  const handleSelecaoSugestao = async (item: any) => {
    if (item.type === "especialidade") {
      setEspecialidadeId(item.key);
      setEspecialidadeNome(item.nome);
      setConsulta((prev) => ({
        ...prev,
        especialidade: item.nome || "",
      }));
    } else if (item.type === "medico") {
      setMedico(item);
      setEspecialidadeId(item.especialidadeId);
      setEspecialidadeNome(item.especialidadeNome);
      handleMedicoSelect(item);
    }
  };

  const handleMedicoSelect = (medico: any) => {
    setConsulta((prev) => ({
      ...prev,
      medico: medico.nome || "",
      especialidade: especialidadeNome || "",
    }));
    setDiasDisponiveis(medico.diasAtendimento || []);
    setCalendarioVisivel(true);
  };

  const handleDateSelect = (date: string) => {
    setDataConsulta(date);
    setConsulta((prev) => ({
      ...prev,
      data: date || "",
    }));
    setHorarioVisivel(true);
  };

  const handleTimeSelect = (time: string) => {
    setHorarioConsulta(time);
    setConsulta((prev) => ({
      ...prev,
      horario: time || "",
    }));
  };

  const handleConfirm = async () => {
    try {
      const novaConsulta = {
        ...consulta,
        usuario: usuario || "",
        data: dataConsulta || "",
        horario: horarioConsulta || "",
      };
      await salvarConsulta(novaConsulta);
      setConfirmacaoVisivel(false);
      Alert.alert("Consulta confirmada!");
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      Alert.alert("Erro ao confirmar consulta.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <HeaderConsulta />
      <SearchBar
        onSearch={handlePesquisar}
        onSugest={handleSugestoes}
        resultados={resultadoPesquisa}
        onSelecionarSugestao={handleSelecaoSugestao}
      />
      <Especialidade
        EspecialidadeCarregada={(id, nome) => {
          setEspecialidadeId(id);
          setEspecialidadeNome(nome); // Armazenar o nome da especialidade
          setConsulta((prev) => ({
            ...prev,
            especialidade: nome || "",
          }));
        }}
        especialidadeSelecionada={especialidadeId}
      />
      <Medico
        especialidadeId={especialidadeId}
        medicoSelecionado={medico ? medico.id : null}
        onMedicoSelect={(medico) => {
          setMedico(medico);
          setConsulta((prev) => ({
            ...prev,
            medico: medico.label || "",
          }));
          setDiasDisponiveis(medico.diasAtendimento || []);
          setCalendarioVisivel(true);
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {resultadoPesquisa.length > 0 ? (
              <FlatList
                data={resultadoPesquisa}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelecaoSugestao(item)}
                    style={styles.resultItem}
                  >
                    <Text style={styles.resultText}>
                      {item.nome} (
                      {item.type === "especialidade"
                        ? "Especialidade"
                        : "Médico"}
                      )
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noResultsText}>
                Nenhum resultado encontrado
              </Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CalendarioConsulta
        visivel={calendarioVisivel}
        onClose={() => setCalendarioVisivel(false)}
        onDateSelect={handleDateSelect}
        diasDisponiveis={diasDisponiveis}
      />

      <HorarioConsulta
        visivel={horarioVisivel}
        onClose={() => setHorarioVisivel(false)}
        onTimeSelect={(time) => {
          handleTimeSelect(time);
          setConfirmacaoVisivel(true);
        }}
      />

      {confirmacaoVisivel && consulta && (
        <ConfirmacaoConsulta
          visivel={confirmacaoVisivel}
          onClose={() => setConfirmacaoVisivel(false)}
          onConfirm={handleConfirm}
          consulta={consulta}
        />
      )}
    </View>
  );
}
