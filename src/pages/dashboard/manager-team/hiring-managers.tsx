import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UsersService } from '../../../app/service/users.service';
import { SX_ROLES } from '../../../app/utility/app-codes';
import { AppLoader } from '../../../components/loader';
import Tabs from '../../../components/tabs';
import TeamMember from '../../../components/team-membe';

export const HiringManagersMembers = () => {
    const [allMembers, setAllMembers] = useState<any[] | []>([]);
    const [loading, setLoading] = useState(false);
    const companyUuid = sessionStorage.getItem('company_uuid') || '';

    useEffect(() => {
        getHRTeam('');
    }, []);

    const getHRTeam = (search: string) => {
        setLoading(true);
        UsersService.getUsersByRole(companyUuid, 'ea0308c8-16cf-4d7f-bca9-483cc14bb3c1', search).then(res => {
            if (res.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setAllMembers([...res]);
                setLoading(false);
            }
        });
    }

    const onActions = (data: any) => {
        if (data.type === 'delete') {
            setLoading(true);
            data.data.map((data: any, index: number) => {
                UsersService.deleteUser(data.user_uuid).then(res => {
                    if (res.error) {
                        toast.error(res?.error?.message);
                        setLoading(false);
                    } else {
                        getHRTeam('');
                        setLoading(false);
                    }
                });
            })
        } else if (data.type === 'makeAdmin' || data.type === 'makeHrManager') {
            setLoading(true);
            const updateData = {
                user_uuid: data.data[0]?.user_uuid,
                role_uuid: data?.role?.uuid
            }
            UsersService.updateUserRole(updateData).then(res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    getHRTeam('');
                    setLoading(false);
                }
            });
        } else if (data.type === 'temporarilyDeactivate') {
            setLoading(true);
            UsersService.temporarilyDeactivate(data.data[0]?.user_uuid, '2').then(res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    getHRTeam('');
                    setLoading(false);
                }
            });
        } else if (data.type === 'search') {
            getHRTeam(data.data);
        }
    }
    return (
        <>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div>
                <TeamMember membersData={allMembers} onActions={(event) => onActions(event)}></TeamMember>
            </div>
        </>
    )
}
