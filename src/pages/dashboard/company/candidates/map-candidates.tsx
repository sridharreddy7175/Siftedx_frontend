import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export const MapCandidatesList = () => {
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([{ name: 'Java', id: 1 }, { name: 'Javascript', id: 2 }, { name: 'React js', id: 2 }]);
    useEffect(() => {
    }, []);

    const onSelect = (selectedList: any, selectedItem: any) => {
        const skills: any = [];
        selectedList.map((skill: any) => {
            skills.push(skill.name);
        })
    }

    const onRemove = (selectedList: any, removedItem: any) => {
    }
    return (
        <div>
            <div className="row">
                <div className="col-md-8">
                    <h2>Map Jobs To Candidates</h2>
                </div>

            </div>
            {loading &&
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
            <div className="row" style={{ marginBottom: '15px' }}>
                <div className="col-md-12">
                    <div className='row'>
                        <div className='col-md-5' style={{ border: "1px solid #ccc", margin: "0px 10px", padding: "15px" }}>
                            <label>Selected Candidates</label>
                            <p className='my-2'>1. Srinu</p>
                        </div>
                        <div className='col-md-6' style={{ border: "1px solid #ccc", padding: "15px" }}>
                            <label>Jobs</label>
                            <Multiselect
                                options={skills}
                                selectedValues={''}
                                onSelect={onSelect}
                                onRemove={onRemove}
                                displayValue="name"
                                avoidHighlightFirstOption={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="py-3 mt-4 text-center">
                    <a className="small_btn px-5 rounded-12 cursor-pointer" >Save</a>
                    <Link className="btn btn-danger px-5 rounded-12 text-decoration-none ms-2 cursor-pointer" to={`/dashboard/companies/info/ad7287a1-6951-45b7-a29f-3d54437d29da/candidates`}>Cancel</Link>
                </div>
            </div>
        </div>
    )
}