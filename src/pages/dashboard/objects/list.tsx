import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { DataTable } from '../../../components/data-table';
import { ObjectsDataGridCols } from './data-grid-cols'

export const ObjectsList = () => {
    const [pageArray, setPageNumbers] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [rolesList, setRolesList] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    useEffect(() => {
    }, []);

    const onSearchText = (data: any) => {
    };

    const onPageChange = (data: any) => {
        if (data) {
            history.push(`/dashboard/roles?page=${data}`);
        }
        setActivePage(data);
        const pageNumber = data - 1;
    }

    const onEditObject = (data: any) => {
        history.push(`/dashboard/roles/form/${data.id}`);
    }

    const onDeleteObject = (data: any) => {
        setLoading(true);
        const id = data.id;
    }

    return (
        <div className="row border-top border-primary py-3">
            <div className="row">
                <div className="col-md-10">
                    <h2>Objects</h2>
                </div>
                <div className="border-primary py-3 text-end col-md-2">
                    <Link to={`/dashboard/objects/form/0`} className="small_btn px-5 rounded-12">Add</Link>
                </div>
            </div>
            <div className='siftedx-table mt-2'>
                {loading &&
                    <div className="text-center p-5">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                }
                {!loading && <DataTable TableCols={ObjectsDataGridCols} tableData={rolesList} editInfo={onEditObject} deleteInfo={onDeleteObject}
                    activePageNumber={activePage} searchText={onSearchText} pageNumber={onPageChange} pageNumbers={pageArray}></DataTable>}
            </div>
        </div>
    )
}
