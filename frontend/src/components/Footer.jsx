import React from "react"
import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="">
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p className="text-light">
              All Rights Reserved to Basil Jiji &copy; {currentYear}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
