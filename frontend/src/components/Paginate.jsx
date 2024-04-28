import { Pagination, Container, Row } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

const Paginate = ({ pages, page }) => {
    const totalPages = Math.ceil(pages)
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1
    const endPage = Math.min(startPage + 9, totalPages)

    return (
        totalPages > 1 && (
            <Container className="d-flex justify-content-center">
                <Row>
                    <Pagination>
                        {startPage > 1 && (
                            <LinkContainer to={`/admin/period/${startPage - 1}`}>
                                <Pagination.Prev />
                            </LinkContainer>
                        )}
                        {[...Array(endPage - startPage + 1).keys()].map((index) => (
                            <LinkContainer
                                key={startPage + index}
                                to={`/admin/period/${startPage + index}`}
                            >
                                <Pagination.Item active={startPage + index === currentPage}>
                                    {startPage + index}
                                </Pagination.Item>
                            </LinkContainer>
                        ))}
                        {endPage < totalPages && (
                            <LinkContainer to={`/admin/period/${endPage + 1}`}>
                                <Pagination.Next />
                            </LinkContainer>
                        )}
                    </Pagination>
                </Row>
            </Container>
        )
    )
};


export default Paginate