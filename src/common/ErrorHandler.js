const errorHandler = (error) => {

    let resMessage;

    if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        resMessage = error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        resMessage = error.request;
    
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        resMessage = error.message;
      }
      return resMessage;
}

export default errorHandler;