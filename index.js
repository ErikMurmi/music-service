
const {db} = require("./firebase");

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const Collections = {
    USERS: 'users',
    ARTISTS: 'artists',
    ALBUMS: 'albums'
}

app.use(express.json());

/**ALBUMS */

app.get('/albums', async (req, res) => {
  const collectionRef = db.collection(Collections.ALBUMS);
  const snapshot = await collectionRef.get();
  const documents = snapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return res.status(200).json(documents);
});

app.post('/albums', async (req, res) => {
  const body = req.body;
  const albumsRef = db.collection(Collections.ALBUMS);
  const result = await albumsRef.add(body);
  //console.log(result);
  return res.status(200).json(result);
});


app.delete('/albums/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.collection(Collections.ALBUMS).doc(id).delete();
    return res.status(204).json(result);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

/**ARTISTAS */

app.get('/artists', async (req, res) => {
  const collectionRef = db.collection(Collections.ARTISTS);
  const snapshot = await collectionRef.get();
  const documents = snapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return res.status(200).json(documents);
});

app.post('/artists', async (req, res) => {

  const body = req.body;
  const artistsRef = db.collection(Collections.ARTISTS);
  const result = await artistsRef.add(body);
  //console.log(result);
  return res.status(200).json(result);
});


app.get('/artistByName', async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).send('Se debe enviar un nombre');
  }
  const artistsRef = db.collection(Collections.ARTISTS);
  const querySnapshot = await artistsRef.where("name", "==", name).get();

  if (querySnapshot.empty) {
    return res.status(400).send("No se encontró un artista con ese nombre");
  }

  const result = querySnapshot.docs[0].data();
  return res.status(200).json(result);
});


app.delete('/artists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.collection(Collections.ARTISTS).doc(id).delete();
    return res.status(204).json("Se elimino correctamente "+ result);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor en el puerto ${port}`);
});
