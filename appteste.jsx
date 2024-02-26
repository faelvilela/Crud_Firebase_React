import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import './styles.css';
import Modal from 'react-modal';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAgrh_xaXDlBiaANqfCglASncRBzjMqmO8",
  authDomain: "rhapp-bafe6.firebaseapp.com",
  projectId: "rhapp-bafe6",
});

export const App = () => {
  const [name, setName] = useState("")
  const [setor, setSetor] = useState("")
  const [cpf, setCpf] = useState("")
  const [id_func, setId] = useState("")
  const [dataadm, setDataAdm] = useState("")
  const [users, setUsers] = useState([])
  const [editingUserId, setEditingUserId] = useState(null);

  const db = getFirestore(firebaseApp);
  const usersCollectionRef = collection(db, "users");

  async function criarUser() {
    if (editingUserId) {
      // Atualizar usuário existente
      const userDoc = doc(db, 'users', editingUserId);
      await updateDoc(userDoc, {
        name,
        setor,
        cpf,
        id_func,
        dataadm,
      });
      setEditingUserId(null); // Limpar o ID de edição
    } else {
        try {
          const user = await addDoc(collection(db, "users"), {
            name,
            setor,
            cpf,
            id_func,
            dataadm,
          });
          setEditingUserId(null);
          console.log("dados salvos com sucessos", user);
        } catch (e) {
          console.error("Error adding document: ", e);
        }

    }
    
  }

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  async function deleteUser(id) {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  }


  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null); // Limpar o ID de edição ao fechar o modal
  };

  const openEditModal = (user) => {
    // Preencher os campos com os dados do usuário antes de abrir o modal
    setName(user.name);
    setSetor(user.setor);
    setCpf(user.cpf);
    setId(user.id_func);
    setDataAdm(user.dataadm);
    setEditingUserId(user.id);

    openModal();
  };

  return (
    <div>
      <button onClick={openModal}>Criar Usuário</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Criar/Editar Usuário"
      >
        <h2>{editingUserId ? 'Editar Usuário' : 'Criar Usuário'}</h2>
        <label>Nome: </label>
        <br></br>
        <input
          type="text"
          placeholder='Nome...'
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br></br>

        <label>Setor: </label>
        <br></br>
        <input
          type="text"
          placeholder='Setor...'
          value={setor}
          onChange={(e) => setSetor(e.target.value)}
        /><br></br>

        <label>CPF: </label>
        <br></br>
        <input
          type="text"
          placeholder='CPF...'
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        /><br></br>

        <label>ID: </label>
        <br></br>
        <input
          type="text"
          placeholder='ID...'
          value={id_func}
          onChange={(e) => setId(e.target.value)}
        /><br></br>

        <label>Data de Admissão: </label>
        <br></br>
        <input
          type="text"
          placeholder='Data Admissão...'
          value={dataadm}
          onChange={(e) => setDataAdm(e.target.value)}
        /><br></br>

        <button onClick={() => {
          criarUser();
          closeModal();
        }}>{editingUserId ? 'Editar' : 'Criar'} Usuário</button>
        <button onClick={closeModal}>Fechar</button>
      </Modal>

      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: '13%' }}>Ações</th>
            <th>ID</th>
            <th>Nome</th>
            <th>Setor</th>
            <th>CPF</th>
            <th>Data Admissão</th>

          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <button onClick={() => openEditModal(user)}>Editar</button>
                <button onClick={() => deleteUser(user.id)}>Deletar</button>
              </td>
              <td>{user.id_func}</td>
              <td>{user.name}</td>
              <td>{user.setor}</td>
              <td>{user.cpf}</td>
              <td>{user.dataadm}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};