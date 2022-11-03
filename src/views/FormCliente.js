import React from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function ClientesRegistroActividad() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4" className="bg-dangerr text-whitee">
                  Cliente
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label>Responsable (disabled)</label>
                        <Form.Control
                          defaultValue="drenteria@dobleaasesorias.com"
                          disabled
                          type="email"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="7">
                      <Form.Group>
                        <label htmlFor="inputNombre">Funcionario</label>
                        <Form.Control
                          defaultValue="Duhan Enrique Renteria Hernandez"
                          disabled
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="2">
                      <Form.Group>
                        <label>Fecha inicio</label>
                        <Form.Control
                          placeholder="Fecha inicio"
                          type="date"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="2">
                      <Form.Group>
                        <label>Fecha final</label>
                        <Form.Control
                          placeholder="Fecha final"
                          type="date"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label>Area de registro</label>
                        <select class="form-control">
                          <option>Seleccionar opcion</option>
                          <option value="Contabilidad">Contabilidad</option>
                          <option value="Tributaria">Tributaria</option>
                          <option value="Revisoría">Revisoría</option>
                        </select>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <label>Empresa cliente</label>
                      <select class="form-control">
                        <option>Seleccionar opcion</option>
                        <option value="1">Empresa One</option>
                        <option value="2">Empresa Two</option>
                        <option value="3">Empresa Three</option>
                      </select>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Etapa</label>
                        <select class="form-control">
                          <option>Seleccionar opcion</option>
                          <option value="Contabilidad">
                            Etapa Contabilidad
                          </option>
                          <option value="Tributaria">Etapa Tributaria</option>
                          <option value="Revisoría">Etapa Revisoría</option>
                        </select>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <label>Actividades</label>
                      <select class="form-control">
                        <option>Seleccionar opcion</option>
                        <option value="1">Actividad One</option>
                        <option value="2">Actividad Two</option>
                        <option value="3">Actividad Three</option>
                      </select>
                    </Col>
                    <Col className="pl-1" md="4">
                      <label>Tiempos</label>
                      <select class="form-control">
                        <option>Seleccionar opcion</option>
                        <option value="0.5">1/2 Hora</option>
                        <option value="1.0">1 Hora</option>
                        <option value="1.5">1.5 Horas</option>
                        <option value="2.0">2 Horas</option>
                        <option value="2.5">1.5 Horas</option>
                        <option value="3.0">3 Horas</option>
                        <option value="3.5">3.5 Horas</option>
                        <option value="4.0">4 Horas</option>
                        <option value="4.5">4.5 Horas</option>
                        <option value="5.0">5 Horas</option>
                        <option value="5.5">5.5 Horas</option>
                        <option value="6.0">6 Horas</option>
                        <option value="6.5">6.5 Horas</option>
                        <option value="7.0">7 Horas</option>
                        <option value="7.5">7.5 Horas</option>
                        <option value="8.0">8 Horas</option>
                        <option value="8.5">8.5 Horas</option>
                        <option value="9.0">9 Horas</option>
                        <option value="9.5">9.5 Horas</option>
                        <option value="10.0">10 Horas</option>
                        <option value="10.5">10.5 Horas</option>
                        <option value="11.0">11 Horas</option>
                        <option value="11.5">11.5 Horas</option>
                        <option value="12.0">12 Horas</option>
                      </select>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Observaciones</label>
                        <Form.Control
                          cols="80"
                          defaultValue=""
                          placeholder="Here can be your description"
                          rows="4"
                          as="textarea"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      label="¿Es necesario hacer seguimiento al registro?"
                    />
                  </Form.Group>
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Agregar
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <div className="card-image">
                <img
                  alt="..."
                  src={require("assets/img/photo-1431578500526-4d9613015464.jpeg")}
                ></img>
              </div>
              <Card.Body>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={require("assets/img/faces/face-0.jpg")}
                    ></img>
                    <h5 className="title">Alex King</h5>
                  </a>
                  <p className="description">Bambini</p>
                </div>
                <p className="description text-center">
                  "Lamborghini Mercy <br></br>
                  Your chick she so thirsty <br></br>
                  I'm in that two seat Lambo"
                </p>
              </Card.Body>
              <hr></hr>
              <div className="button-container mr-auto ml-auto">
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-facebook-square"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-google-plus-square"></i>
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ClientesRegistroActividad;
