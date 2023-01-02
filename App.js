import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Person from "./src/services/sqlite/Person";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

export default function App() {
  const [person, setPerson] = useState({ name: "", age: "", email: "" });
  const [dataB, setDataB] = useState();
  const [idClienteEdit, setIdClientEdit] = useState();
  const [editCliente, setEditCliente] = useState(false);

  useEffect(() => {
    Person.all().then((persons) => setDataB(persons));
  }, []);

  async function Cadastrar() {
    await Person.create({
      name: person.name,
      age: person.age,
      email: person.email,
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
    setPerson({ name: "", age: "", email: "" });
    Person.all().then((persons) => setDataB(persons));
  }

  async function Editar(id) {
    await Person.find(id)
      .then((person) =>
        setPerson({ name: person.name, age: person.age, email: person.email })
      )
      .catch((err) => console.log(err));
    setIdClientEdit(id);
    setEditCliente(true);
  }

  async function SalvarEdicao() {
    await Person.update(idClienteEdit, {
      name: person.name,
      age: person.age,
      email: person.email,
    });
    setPerson({ name: "", age: "", email: "" });
    setIdClientEdit();
    setEditCliente(false);
    Person.all().then((persons) => setDataB(persons));
  }

  async function Excluir(id) {
    await Person.remove(id)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
    Person.all().then((persons) => setDataB(persons));
  }

  function CancelarEdit() {
    setPerson({ name: "", age: "", email: "" });
    setIdClientEdit();
    setEditCliente(false);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ marginTop: 50 }}>
            Insira os dados abaixo para cadastrar
          </Text>
          <TextInput
            value={person.name}
            onChangeText={(name) => setPerson({ ...person, name: name })}
            placeholder={"Nome"}
            style={styles.input}
          />
          <TextInput
            value={person.age}
            onChangeText={(age) => setPerson({ ...person, age: age })}
            placeholder={"Idade"}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            value={person.email}
            onChangeText={(email) => setPerson({ ...person, email: email })}
            placeholder={"Email"}
            style={styles.input}
            keyboardType="email-address"
          />
          {!editCliente ? (
            <TouchableOpacity style={styles.button} onPress={Cadastrar}>
              <Text style={{ color: "#fff" }}>Cadastrar</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={SalvarEdicao}>
                <Text style={{ color: "#fff" }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={CancelarEdit}
              >
                <Text style={{ color: "#fff" }}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}

          <View>
            <Text style={{ marginTop: 50 }}>
              Abaixo os usuários cadastrados
            </Text>
            {dataB &&
              dataB.map((item) => {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View key={item.id}>
                      <Text> Nome: {item.name}</Text>
                      <Text> Idade: {item.age}</Text>
                      <Text> Email:{item.email}</Text>
                    </View>
                    <View style={{ marginLeft: 15 }}>
                      <TouchableOpacity
                        style={styles.edit}
                        onPress={() => Editar(item.id)}
                      >
                        <AntDesign name="edit" size={18} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.delete}
                        onPress={() => Excluir(item.id)}
                      >
                        <EvilIcons name="trash" size={22} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 10,
    backgroundColor: "#e8e8e8",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#247c57",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: 250,
    height: 44,
  },
  buttonCancel: {
    alignItems: "center",
    backgroundColor: "#aa1212",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: 250,
    height: 44,
  },
  edit: {
    alignItems: "center",
    backgroundColor: "#0d6c9b",
    borderRadius: 10,
    marginTop: 5,
    width: 35,
    height: 35,
    justifyContent: "center",
  },
  delete: {
    alignItems: "center",
    backgroundColor: "#aa1212",
    borderRadius: 10,
    marginTop: 5,
    width: 35,
    height: 35,
    justifyContent: "center",
  },
});
