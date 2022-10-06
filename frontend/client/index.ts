import axios from 'axios';

const apiClient = () => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Create instance
    let instance = axios.create(defaultOptions);

    //Set the AUTH token for any request
    instance.interceptors.request.use(function (config) {
        //const token = '';
        //config.headers.Authorization =  token;
        return config;
    });

    return instance;
};

export default apiClient();
