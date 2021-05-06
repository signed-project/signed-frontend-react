import { useState } from "react";
import { useSelector } from "react-redux";
import { filesApi } from "../../config/http.config";
import mime from 'mime/lite';

const useFiles = () => {
  const axios = useSelector((state) => state.axios.axios);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState({
    isError: false,
    errorText: "",
    code: null,
  });


  const uploadFile = (file, hash) => {
    // mime.getExtension('text/plain');
    const type = mime.getExtension(file.type);
    const fileName = `${hash}.${type}`;
    const formData = new FormData();
    formData.append("File", file, fileName);
    // formData.append("File", file, file.name);
    // formData.append("FileType", fileType);

    setIsLoading(true);

    return axios
      .post(filesApi.UPLOAD_FILE, formData)
      .then((res) => {
        setIsSuccess(true);
        return res;
      })
      .catch((err) => {
        console.log("CATCH ERR: ", err);
        const errors =
          err.response.data.errors || err.response.data.Error.Message;
        let errorString = "";
        if (Object.is(errors)) {
          Object.keys(errors).forEach((err, index) => {
            if (index > 0) {
              errorString += " ";
            }
            errorString += errors[err].join(". ");
          });
        } else {
          errorString = errors;
        }

        setError((prev) => {
          return {
            ...prev,
            isError: true,
            errorText: errorString,
          };
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const uploadFileArr = (file) => {

    console.log('uploadFile^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

    const formData = new FormData();
    formData.append("File", file, file.name);
    // formData.append("FileType", fileType);

    setIsLoading(true);

    return axios
      .post(filesApi.UPLOAD_FILE, formData)
      .then((res) => {
        setIsSuccess(true);
        return res;
      })
      .catch((err) => {
        console.log("CATCH ERR: ", err);
        const errors =
          err.response.data.errors || err.response.data.Error.Message;
        let errorString = "";
        if (Object.is(errors)) {
          Object.keys(errors).forEach((err, index) => {
            if (index > 0) {
              errorString += " ";
            }
            errorString += errors[err].join(". ");
          });
        } else {
          errorString = errors;
        }

        setError((prev) => {
          return {
            ...prev,
            isError: true,
            errorText: errorString,
          };
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };



  const deleteFiles = (fileIds) => {
    setIsLoading(true);

    return axios
      .post(filesApi.DELETE_FILE, { fileIds: fileIds })
      .then((res) => {
        setIsSuccess(true);
        return res;
      })
      .catch((err) => {
        console.error(err);
        setError((prev) => {
          return {
            ...prev,
            isError: true,
          };
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };





  return {
    isLoading,
    isSuccess,
    error,
    uploadFile,
    deleteFiles,
  };
};

export default useFiles;
