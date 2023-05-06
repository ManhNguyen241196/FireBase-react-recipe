import firebase from "./FireBaseConfig";

const firestore = firebase.firestore();

//create data
const creatDocument = (collection, document) => {
  return firestore.collection(collection).add(document);
};

const readDocument = (inforQuery) => {
  let collectionRef = firestore.collection(inforQuery.collection);

  const query = inforQuery.queries;
  if (query && query.length > 0) {
    query.forEach((element) => {
      collectionRef = collectionRef.where(
        element.field,
        element.condition,
        element.value
      );
    });
  }
  return collectionRef.get();
};

const updateDocument = (collection, id, document) => {
  return firestore.collection(collection).doc(id).update(document);
};

const deleteDocument = (collection, id) => {
  return firestore.collection(collection).doc(id).delete();
};

const FirebaseFirestoreService = {
  deleteDocument,
  creatDocument,
  readDocument,
  updateDocument,
};

export default FirebaseFirestoreService;
