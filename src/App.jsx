import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import './styles.css';
import Modal from 'react-modal';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAgrh_xaXDlBiaANqfCglASncRBzjMqmO8",
  authDomain: "rhapp-bafe6.firebaseapp.com",
  projectId: "rhapp-bafe6",
});

export const App = () => {
  const [name, setName] = useState("");
  const [setor, setSetor] = useState("");
  const [cpf, setCpf] = useState("");
  const [id_func, setId] = useState("");
  const [dataadm, setDataAdm] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [dob, setDob] = useState("");
  const [identity, setIdentity] = useState("");
  const [workCard, setWorkCard] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [email, setEmail] = useState("");
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
        address,
        neighborhood,
        city,
        zipCode,
        cellphone,
        dob,
        identity,
        workCard,
        estadoCivil,
        email,
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
          address,
          neighborhood,
          city,
          zipCode,
          cellphone,
          dob,
          identity,
          workCard,
          estadoCivil,
          email,
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

  const resetForm = () => {
    setName("");
    setSetor("");
    setCpf("");
    setId("");
    setDataAdm("");
    setAddress("");
    setNeighborhood("");
    setCity("");
    setZipCode("");
    setCellphone("");
    setDob("");
    setIdentity("");
    setWorkCard("");
    setEstadoCivil("");
    setEmail("");
  };

  const openEditModal = (user) => {
    // Preencher os campos com os dados do usuário antes de abrir o modal
    setName(user.name);
    setSetor(user.setor);
    setCpf(user.cpf);
    setId(user.id_func);
    setDataAdm(user.dataadm);
    setAddress(user.address);
    setNeighborhood(user.neighborhood);
    setCity(user.city);
    setZipCode(user.zipCode);
    setCellphone(user.cellphone);
    setDob(user.dob);
    setIdentity(user.identity);
    setWorkCard(user.workCard);
    setEstadoCivil(user.estadoCivil);
    setEmail(user.email);
    setEditingUserId(user.id);

    openModal();
  };

  const openCreateModal = () => {
    resetForm(); // Limpar os campos do formulário ao abrir o modal para criar um novo usuário
    openModal();
  };

  return (
    <div>
      <button onClick={openCreateModal}>Criar Usuário</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Criar/Editar Usuário"
      >
        <h2>{editingUserId ? 'Editar Usuário' : 'Criar Usuário'}</h2>

        {/* ... (código anterior) */}

        <div class="form-section">
          <h3>Formulario</h3>
          <label>Nome: </label><br></br>
          <input type="text" placeholder='Nome...' value={name} onChange={(e) => setName(e.target.value)} /><br></br>

          <label>Setor: </label><br></br>
          <input type="text" placeholder='Setor...' value={setor} onChange={(e) => setSetor(e.target.value)} /><br></br>

          <label>CPF: </label><br></br>
          <input type="text" placeholder='CPF...' value={cpf} onChange={(e) => setCpf(e.target.value)} /><br></br>

          <label>ID: </label><br></br>
          <input type="text" placeholder='ID...' value={id_func} onChange={(e) => setId(e.target.value)} /><br></br>

          <label>Data de Admissão: </label><br></br>
          <input type="text" placeholder='Data Admissão...' value={dataadm} onChange={(e) => setDataAdm(e.target.value)} /><br></br>

          <label>Celular: </label><br />
          <input type="text" placeholder="Celular..." value={cellphone} onChange={(e) => setCellphone(e.target.value)} /><br />

          <label>Data de Nascimento: </label><br />
          <input type="text" placeholder="Data de Nascimento..." value={dob} onChange={(e) => setDob(e.target.value)} /><br />

          <label>Identidade: </label><br />
          <input type="text" placeholder="Identidade..." value={identity} onChange={(e) => setIdentity(e.target.value)} /><br />

          <label>Carteira de Trabalho: </label><br />
          <input type="text" placeholder="Carteira de Trabalho..." value={workCard} onChange={(e) => setWorkCard(e.target.value)} /><br />

          <label>Estado Civil: </label><br />
          <input type="text" placeholder="Estado Civil..." value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)} /><br />

          <label>Email: </label><br />
          <input type="text" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} /><br />

        </div>

        <div class="address-section">
          <h3>Endereço</h3>
          <label>Endereço: </label><br />
          <input type="text" placeholder="Endereço..." value={address} onChange={(e) => setAddress(e.target.value)} /><br />

          <label>Bairro: </label><br />
          <input type="text" placeholder="Bairro..." value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} /><br />

          <label>Cidade: </label><br />
          <input type="text" placeholder="Cidade..." value={city} onChange={(e) => setCity(e.target.value)} /><br/>

          <label>CEP: </label><br />
          <input type="text" placeholder="CEP..." value={zipCode} onChange={(e) => setZipCode(e.target.value)} /><br/><br/>

          <button onClick={() => {
            criarUser();
            closeModal();
          }}>{editingUserId ? 'Editar' : 'Criar'} Usuário</button>
          <button onClick={closeModal}>Fechar</button>

        </div>
        <div class="clearfix"></div>

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
            <th>Endereço</th>
            <th>Bairro</th>
            <th>Cidade</th>
            <th>CEP</th>
            <th>Celular</th>
            <th>Data Nascimento</th>
            <th>Identidade</th>
            <th>Carteira de Trabalho</th>
            <th>Estado Civil</th>
            <th>Email</th>
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
              <td>{user.address}</td>
              <td>{user.neighborhood}</td>
              <td>{user.city}</td>
              <td>{user.zipCode}</td>
              <td>{user.cellphone}</td>
              <td>{user.dob}</td>
              <td>{user.workCard}</td>
              <td>{user.identity}</td>
              <td>{user.estadoCivil}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};