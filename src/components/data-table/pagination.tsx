import React, { SyntheticEvent, useEffect, useState } from 'react'

interface Props {
    rowsPerPage: number;
    totalRows: number;
    activePage: number;
    currentPage: number;
    onChangePage: (page: number, rowsPerPage: number) => void;
}

export const TablePagination: React.FC<Props> = (props: Props) => {
    const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage);
    const [activePage, setActivePage] = useState(props.activePage);


    const onClickPreviousPage = () => {
        const page = activePage - 1;
        setActivePage(page);
        props.onChangePage(page, rowsPerPage);
    }

    const onClickNextPage = () => {
        const page = activePage + 1;
        setActivePage(page);
        props.onChangePage(page, rowsPerPage);
    }
    const onClickPage = (page: number) => {
        setActivePage(page);
        props.onChangePage(page, rowsPerPage);


    }
    const onChangeRowsPerPage = (e: SyntheticEvent) => {
        const value = Number((e.target as HTMLInputElement).value);
        setRowsPerPage(value);
        props.onChangePage(activePage, value);
    }
    
  


    return (
        <>
            <div className='d-flex justify-content-end pt-3 t-pagination d-none d-lg-flex'>
                {/* d-none d-lg-flex */}
                <nav className='me-3' style={{ float: 'right' }}>
                    <ul className="pagination">
                        {/* <li className="page-item">
                        <a className={`page-link prev me-1 ${activePage === 0 ? 'disabled' : ''}`} onClick={() => onClickPreviousPage()}>
                            <i className="bi bi-chevron-double-left pagination_icon_width"></i>
                        </a>
                    </li> */}
                        <li className="page-item">
                            <a className={`page-link prev me-1 ${activePage === 0 ? 'disabled' : ''}`} onClick={() => onClickPreviousPage()}>
                                <i className="bi bi-chevron-left pagination_icon_width"></i>
                            </a>
                        </li>
                        {Array.apply(null, Array(Math.ceil(props.totalRows / 10) < 1 ? 1 : Math.ceil(props.totalRows / rowsPerPage))).map((exp: any, number: number) => (
                            <li className={activePage === number ? 'active page-item' : 'page-item'} key={number}>
                                <a className="page-link me-1" onClick={() => onClickPage(number)}>{(number + 1)}</a>
                            </li>
                        ))}
                        <li className="page-item">
                            <a className={`page-link next me-1 ${activePage === 1 ? 'disabled' : ''}`} onClick={() => onClickNextPage()}>
                                <i className="bi bi-chevron-right pagination_icon_width"></i>
                            </a>
                        </li>
                        {/* <li className="page-item">
                        <a className={`page-link next  me-1 ${activePage === Math.ceil(props.totalRows / 10) ? 'disabled' : ''}`} onClick={() => onClickNextPage()}>
                            <i className="bi bi-chevron-double-right pagination_icon_width"></i></a>
                    </li> */}
                        <li className="page-item ms-3">
                            <select className="form-control" value={rowsPerPage} onChange={onChangeRowsPerPage}>
                                {/* <option value=""></option> */}
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </li>
                    </ul>
                </nav>
            </div>
            <ul className="pagination pt-3 d-flex justify-content-center  d-lg-none pb-3">
                <li className="page-item">
                    <a className={`page-link prev me-1 ${props.currentPage + activePage === 1 ? 'disabled' : ''}`}  onClick={() => onClickPreviousPage()}>
                        <i className="bi bi-chevron-left pagination_icon_width"></i>
                    </a>
                </li>
                <li className='ms-3 me-3 mt-2 fs_14'>
                    {props.currentPage + activePage}
                </li>

                <li className="page-item">
                    <a className={`page-link next me-1 ${props.currentPage + activePage === 1 ? 'disabled' : ''}`}  onClick={() => onClickNextPage()}>
                        <i className="bi bi-chevron-right pagination_icon_width"></i>
                    </a>
                </li>
            </ul>
        </>
    )
}
