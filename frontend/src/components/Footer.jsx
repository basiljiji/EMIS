import React from "react"
import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  return (
    <footer className="">
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p className="text-light">
              All Rights Reserved to Luvid Technologies &copy; 2023
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
