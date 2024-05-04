import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spinner,
  Dropdown,
  Modal,
  Alert,
} from "react-bootstrap";
import { useAuth } from "./auth/AuthContext";
import { Link } from "react-router-dom";
import { cancelReport, confirmReport, fetchPickers } from "../api/api";
import StarRating from "../components/Stars";

interface Data {
  id: number;
  text: string;
  status: number;
  geo: string;
  img: string;
}

function ModerationPanel() {
  const [data, setData] = useState<Data[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [filteredData, setFilteredData] = useState<Data[] | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [selectedValue, setSelectedValue] = useState<number>(0);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  const { isAuthenticated } = useAuth();

  const statusOptions = [
    "Confirmation of contamination",
    "Confirmed of contamination",
    "Сonfirmation of cleaning",
    "Done",
  ];

  const fetchData = async () => {
    try {
      const response = await fetchPickers();
      if (response.status === 200) {
        console.log(response);
        setData(response.data.data);
        console.log(data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.log(`Failed to fetch data: ${error}`);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetchData();
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (data) {
      if (filterStatus !== null) {
        const filtered = data.filter((item) => item.status === filterStatus);
        setFilteredData(filtered);
      } else {
        setFilteredData(data);
      }
    }
  }, [data, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center mt-8 flex-col items-center ">
        <h3>Кажется, самое время авторизоваться!</h3>
        <div>
          <Link to={"/register"}>
            <Button variant="link">Регистрация</Button>
          </Link>
          /
          <Link to={"/login"}>
            <Button variant="link">Войти</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className=" flex justify-center items-center h-screen">
        <Spinner animation="border" role="status">
          <span className="sr-only">Подгружаем...</span>
        </Spinner>
      </div>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <Alert variant="light">
        <Alert.Heading>Отсутствуют запросы на подтверждение</Alert.Heading>
        <p>
          Кажется, а данный момент нет никаких запросов на подтвержение.
          Попробуйте зайти позже, они обязательно появятся!
        </p>
      </Alert>
    );
  }

  const handlePhotoButtonClick = (
    photo: string,
    id: number,
    text: string,
    status: number
  ) => {
    setSelectedPhoto(photo);
    setSelectedRequestId(id);
    setSelectedComment(text);
    setSelectedStatus(status);
    setShowModal(true);
  };

  const handleApproveRequest = async () => {
    console.log(selectedRequestId);
    console.log(selectedValue);
    try {
      const response = await confirmReport({
        report_id: selectedRequestId!,
        value: selectedValue,
      });
      if (response.status == 200) {
        setData((prevData) =>
          prevData!.filter((item) => item.id !== selectedRequestId)
        );
        setSuccessMessage("Запрос успешно подтвердён.");
      }
    } catch (error) {
      setErrorMessage("Не удалось подтвердить запрос :(");
    } finally {
      setShowModal(false);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, +process.env.REACT_APP_TOASTER_TIMEOUT!);
  };

  const handleRejectRequest = async () => {
    try {
      const response = await cancelReport({
        report_id: selectedRequestId!,
      });
      if (response.status == 200) {
        setData((prevData) =>
          prevData!.filter((item) => item.id !== selectedRequestId)
        );
        setSuccessMessage("Запрос успешно отменён!.");
      }
    } catch (error) {
      setErrorMessage("Не удалось отменить запрос.....Извините....");
    } finally {
      setShowModal(false);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="position-fixed top-0 start-50 translate-middle-x">
        {successMessage && (
          <Alert
            variant="success"
            onClose={() => setSuccessMessage(null)}
            dismissible
          >
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert
            variant="danger"
            onClose={() => setErrorMessage(null)}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
      </div>
      <div className=" flex justify-around">
        <Dropdown>
          <Dropdown.Toggle variant="" id="dropdown-basic">
            Filter by Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setFilterStatus(null)}>
              All
            </Dropdown.Item>
            {statusOptions.map((status, index) => (
              <Dropdown.Item
                key={status}
                onClick={() => setFilterStatus(index)}
              >
                {statusOptions[index]}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="" id="dropdown-basic">
            {`Items per page: ${itemsPerPage}`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[5, 10, 20, 50, 100].map((value) => (
              <Dropdown.Item
                key={value}
                onClick={() => handleItemsPerPageChange(value)}
              >
                {value}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className=" mx-auto rounded-xl ">
        <Table striped bordered hover>
          <thead className="  text-center">
            <tr>
              <th>Статус</th>
              <th>Координаты</th>
              <th>Комментарий</th>
              <th>Фото</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody className="  text-center">
            {currentItems.map((item) => (
              <tr key={item.id} className="">
                <td>
                  {item.status >= 0 && item.status < statusOptions.length
                    ? statusOptions[item.status]
                    : "Успешно выполнили!"}
                </td>
                <td>{item.geo}</td>
                <td>{item.text}</td>
                <td className="align-middle">
                  <Button
                    variant="link"
                    onClick={() =>
                      handlePhotoButtonClick(
                        item.img,
                        item.id,
                        item.text,
                        item.status
                      )
                    }
                  >
                    View Photo
                  </Button>
                </td>
                <td className="align-middle">
                  {item.status === 0 || item.status === 2
                    ? "Ждёт подтверждения"
                    : item.status === 1
                    ? "Ждёт уборки"
                    : item.status === 3
                    ? "Дело сделано!"
                    : "Дело сделано!"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="pagination gap-2">
          {Array.from({
            length: Math.ceil(filteredData.length / itemsPerPage),
          }).map((_, index) => (
            <Button
              variant="outline-secondary"
              key={index}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Детали запроса</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3 justify-center ">
            <img
              src={`data:image/jpeg;base64,${selectedPhoto}`}
              alt="Photo"
              className="img-fluid"
            />
            {selectedStatus == 0 || selectedStatus == 2 ? (
              <StarRating totalStars={5} set={setSelectedValue}></StarRating>
            ) : (
              <></>
            )}
            <span>{selectedComment}</span>
          </div>
        </Modal.Body>
        {selectedStatus == 0 || selectedStatus == 2 ? (
          <Modal.Footer>
            <Button variant="success" onClick={handleApproveRequest}>
              Подтвердить запрос
            </Button>
            <Button variant="danger" onClick={handleRejectRequest}>
              Отклонить запрос
            </Button>
          </Modal.Footer>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
}

export default ModerationPanel;
