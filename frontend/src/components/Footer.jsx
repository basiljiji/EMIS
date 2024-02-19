import React from "react"
import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-secondary text-light" fluid>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>All Rights Reserved to Basil Jiji &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
