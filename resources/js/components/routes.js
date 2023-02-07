import { lazy } from 'react';

export default [
  {
    path: '/app/dashboard',
    component: lazy(() => import('./Dashboard/Dashboard')),
    exact: true,
  },
  {
    path: '/app/reservemgr',
    component: lazy(() => import('./Dashboard/Menu/ReserveMgr')),
    exact: true,
  },
  {
    path: '/app/customermaster',
    component: lazy(() => import('./Dashboard/Master/CustomerMaster')),
    exact: true,
  },
  {
    path: '/app/storemaster',
    component: lazy(() => import('./Dashboard/Master/StoreMaster')),
    exact: true
  },
  {
    path: '/app/therapistmaster',
    component: lazy(() => import('./Dashboard/Master/TherapistMaster')),
    exact: true
  },
  {
    path: '/app/accountmaster_menu/',
    component: lazy(() => import('./Dashboard/Master/AccountMaster/AccountMenuMaster')),
    exact: true
  },
  {
    path: '/app/accountmaster_course/',
    component: lazy(() => import('./Dashboard/Master/AccountMaster/AccountCourseMaster')),
    exact: true
  },
  {
    path: '/app/accountmaster_assign/',
    component: lazy(() => import('./Dashboard/Master/AccountMaster/AccountAssignMaster')),
    exact: true
  },
  {
    path: '/app/accountmaster_option/',
    component: lazy(() => import('./Dashboard/Master/AccountMaster/AccountOptionMaster')),
    exact: true
  },
  {
    path: '/app/accountmaster_payment/',
    component: lazy(() => import('./Dashboard/Master/AccountMaster/AccountPaymentMaster')),
    exact: true
  },
  {
    path: '/app/accountmaster_extend/',
    component: lazy(() => import('./Dashboard/Master/AccountMaster/AccountExtendMaster')),
    exact: true
  },
  {
    path: '/app/referrermaster/',
    component: lazy(() => import('./Dashboard/Master/ReferrerMaster')),
    exact: true
  },
  {
    path: '/app/usermaster/',
    component: lazy(() => import('./Dashboard/Master/UserMaster')),
    exact: true
  },
  {
    path: '/app/therapistservice/',
    component: lazy(() => import('./Dashboard/Therapist/TherapistService')),
    exact: true
  },
  {
    path: '/app/therapistmanagement/',
    component: lazy(() => import('./Dashboard/Therapist/TherapistManagement')),
    exact: true
  },
  {
    path: '/app/therapistshift/',
    component: lazy(() => import('./Dashboard/Therapist/TherapistShift')),
    exact: true
  },
  {
    path: '/app/salesmgr/',
    component: lazy(() => import('./Dashboard/Menu/SalesMgr/SalesMgr')),
    exact: true
  },
  {
    path: '/app/salesmgr_byday/',
    component: lazy(() => import('./Dashboard/Menu/SalesMgr/SalesMgrByDay')),
    exact: true
  },
  {
    path: '/app/salesmgr_bymonth/',
    component: lazy(() => import('./Dashboard/Menu/SalesMgr/SalesMgrByMonth')),
    exact: true
  },
  {
    path: '/app/salesmgr_bytherapist/',
    component: lazy(() => import('./Dashboard/Menu/SalesMgr/SalesMgrByTherapist')),
    exact: true
  },
  {
    path: '/app/dailyreport/',
    component: lazy(() => import('./Dashboard/Menu/DailyReport')),
    exact: true
  },
  // {
  //   path: '/app/staff_schedule/',
  //   component: lazy(() => import('./Dashboard/Menu/Schedule/StaffSchedule')),
  //   exact: true
  // },
  {
    path: '/app/customermgr/',
    component: lazy(() => import('./Dashboard/Menu/CustomerMgr')),
    exact: true
  },
]
