import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spinner,
  Dropdown,
  Modal,
  Alert,
} from "react-bootstrap";
import { MODERATION_DATA } from "../data_samples/moderation_panel";
import { useAuth } from "./auth/AuthContext";
import { Link } from "react-router-dom";

interface Data {
  id: number;
  status: number;
  coordinates: string;
  photo: string;
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();

  const statusOptions = [
    "Confirmation of contamination",
    "Confirmed of contamination",
    "Сonfirmation of cleaning",
    "Done",
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setTimeout(() => {
      setData(MODERATION_DATA);
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (data) {
      // Apply filter if filterStatus is not null
      if (filterStatus !== null) {
        const filtered = data.filter((item) => item.status === filterStatus);
        setFilteredData(filtered);
      } else {
        // If no filter is applied, use the original data
        setFilteredData(data);
      }
    }
  }, [data, filterStatus]);

  useEffect(() => {
    setCurrentPage(1); // Reset current page when filtered data changes
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
          <Link
            // className="px-6 py-3 bg-gray-500 text-white rounded-lg text-lg font-semibold hover:bg-gray-600"
            to={"/register"}
          >
            <Button variant="link">Регистрация</Button>
          </Link>
          /
          <Link
            // className=" bg-gray-500 text-white rounded-lg text-lg font-semibold hover:bg-gray-600"
            to={"/login"}
          >
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
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <Alert variant="light">
        <Alert.Heading>Отстувуют запросы на подтверждение</Alert.Heading>
        <p>
          Кажется, а данный момент нет никаких запросов на подтвержение.
          Попробуйте зайти позже, они обязательно появятся!
        </p>
      </Alert>
    );
  }

  const handlePhotoButtonClick = (photo: string, id: number) => {
    setSelectedPhoto(photo);
    setSelectedRequestId(id);
    setShowModal(true);
  };

  const handleApproveRequest = async () => {
    try {
      // Send approve request
      // await approveRequest(selectedRequestId!);
      setSuccessMessage("Request approved successfully.");
      // Remove the request from the table
      // Here, you might have a function to update your data source (e.g., remove the item from the array)
    } catch (error) {
      setErrorMessage("Failed to approve request.");
    } finally {
      setShowModal(false);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, +process.env.REACT_APP_TOASTER_TIMEOUT!); // Hide message
  };

  const handleRejectRequest = async () => {
    try {
      // Send reject request
      // await rejectRequest(selectedRequestId!);
      setSuccessMessage("Request rejected successfully.");
      // Remove the request from the table
      // Here, you might have a function to update your data source (e.g., remove the item from the array)
    } catch (error) {
      setErrorMessage("Failed to reject request.");
    } finally {
      setShowModal(false);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000); // Hide message after 5 seconds
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
              <th>Status</th>
              <th>Coordinates</th>
              <th>Photo</th>
              <th>Confirm</th>
            </tr>
          </thead>
          <tbody className="  text-center">
            {currentItems.map((item) => (
              <tr key={item.id} className="">
                <td>{statusOptions[item.status]}</td>
                <td>{item.coordinates}</td>
                <td className="align-middle">
                  <Button
                    variant="link"
                    onClick={() => handlePhotoButtonClick(item.photo, item.id)}
                  >
                    View Photo
                  </Button>
                </td>
                <td className="align-middle">
                  {item.status === 0 || item.status === 2
                    ? "Waiting for confirming"
                    : item.status === 1
                    ? "Waiting for cleaning"
                    : item.status === 3
                    ? ""
                    : "Error"}
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
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`data:image/jpeg;base64,${selectedPhoto}`}
            alt="Photo"
            className="img-fluid"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleApproveRequest}>
            Подтвердить запрос
          </Button>
          <Button variant="danger" onClick={handleRejectRequest}>
            Отклонить запрос
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModerationPanel;
