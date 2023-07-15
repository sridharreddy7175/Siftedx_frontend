import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useParams } from 'react-router-dom'
import { CompanyService } from '../../../app/service/company.service';
import { SX_ROLES } from '../../../app/utility/app-codes';
import Tabs from '../../../components/tabs';
import NestedDashboard from '../../../routes/insidedashboard';

export const CompanyInfo = () => {
  const [companyData, setCompanyData] = useState<any>();
  let { id } = useParams<{ id: string }>();
  const companyId = id;
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const locationPathStr = useLocation().pathname;
  const companyUuid = id || sessionStorage.getItem('company_uuid') || '1';
  const locationPath = useLocation().pathname;
  const tabsData = [
    {
      path: `/dashboard/companies/info/${companyId}/users`,
      label: 'Users',
      count: ''
    },
    {
      path: `/dashboard/companies/info/${companyId}/candidates`,
      label: 'Candidates',
      count: ''
    },
    {
      path: `/dashboard/companies/info/${companyId}/jobslist`,
      label: 'Jobs',
      count: ''
    },
    {
      path: `/dashboard/companies/info/${companyId}/interviews`,
      label: 'Interviews',
      count: ''
    }
  ]
  const role = sessionStorage.getItem('userRole');
  useEffect(() => {
    if (companyId) {
      CompanyService.getCompanyById(companyId).then(res => {
        setCompanyData(res);
      });
    }
  }, []);

  return (
    <div className="row border-top border-primary background-gray px-0 py-2 pt-3">
      {role === SX_ROLES.SuperAdmin && <div>
        <h5>Company Info: {companyData?.company_name}</h5>
      </div>}
      <div>
        <div className="mt-2">
          <div className='d-flex w-98 m-2'>
            {role === SX_ROLES.SuperAdmin && <div className='w-50'>
              <Tabs tabsData={tabsData} active={locationPath}></Tabs>
            </div>}
            <div className="text-end w-50">
              {locationPath === `/dashboard/companies/info/${companyUuid}/users` && <Link to={`/dashboard/companies/info/${id}/userform/0`} className="small_btn px-5 rounded-12">Add</Link>}
              {locationPath === '/dashboard/candidates' &&
                <Link to={`/dashboard/candidates/${companyId}/form/0`} className="small_btn px-5 rounded-12">Add</Link>}
              {locationPath === `/dashboard/companies/info/${companyId}/candidates` &&
                <Link to={`/dashboard/companies/info/${companyId}/candidateform/0`} className="small_btn px-5 rounded-12">Add</Link>}
            </div>
          </div>
          <div>
            <NestedDashboard />
          </div>
        </div>
      </div>
    </div>
  )
}

