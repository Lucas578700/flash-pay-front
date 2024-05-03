const extractErrorDetails = (error) => {
    let errorDetails = [];
  
    if (error.response && error.response.data && error.response.data.detail) {
      errorDetails.push(error.response.data.detail);
    }

    if (error.response && error.response.data && error.response.data.error) {
      errorDetails.push(error.response.data.error);
    }

    if (error.response && error.response.data && error.response.data.message) {
      errorDetails.push(error.response.data.message);
    }
  
    if (
      error.response &&
      error.response.data &&
      error.response.data.non_field_errors
    ) {
      errorDetails.push(error.response.data.non_field_errors);
    }
  
    return errorDetails.join(", ");
  };
  
export default extractErrorDetails;