import React from "react";
import { useLocation, NavLink, Link } from "react-router-dom";

import "../../assets/css/dataTable/dataTables.bootstrap4.min.css";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function TableEtapa() {


    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
        },
        {
            name: 'Year',
            selector: row => row.year,
        },
    ];

    const data = [
        {
            id: 1,
            title: 'Beetlejuice',
            year: '1988',
        },
        {
            id: 2,
            title: 'Ghostbusters',
            year: '1984',
        },
    ]

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Etapas</Card.Title>
                <p className="card-category">
                Registro actividades
                </p>
                <Button
                    className="btn-fill pull-rightt"
                    type="submit"
                    variant="info"
                  >
                    Nuevo
                  </Button>
                  {/* <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink> */}

                  <Link to="./atapas/nuevo">About</Link>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table id="TableEtapas" className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">NOMBRE</th>
                      <th className="border-0">ESTADO</th>
                      <th className="border-0">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Dakota Rice</td>
                      <td>Activo</td>
                      <td>
                          <button type="button" className="btn btn-outline-warning ml-2">Editar</button>
                          <button type="button" className="btn btn-danger ml-2">Eliminar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Minerva Hooper</td>
                      <td>Activo</td>
                      <td>
                          <button type="button" className="btn btn-outline-warning ml-2">Editar</button>
                          <button type="button" className="btn btn-danger ml-2">Eliminar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sage Rodriguez</td>
                      <td>Activo</td>
                      <td>
                          <button type="button" className="btn btn-outline-warning ml-2">Editar</button>
                          <button type="button" className="btn btn-danger ml-2">Eliminar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Philip Chaney</td>
                      <td>Activo</td>
                      <td>
                          <button type="button" className="btn btn-outline-warning ml-2">Editar</button>
                          <button type="button" className="btn btn-danger ml-2">Eliminar</button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TableEtapa;

// $(document).ready(function () {
//     $('#TableEtapas').DataTable();
// });
