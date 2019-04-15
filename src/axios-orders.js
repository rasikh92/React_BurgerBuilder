import Axios from "axios";

const instance = Axios.create({
    baseURL: 'https://react-5608b.firebaseio.com/'
});

export default instance;