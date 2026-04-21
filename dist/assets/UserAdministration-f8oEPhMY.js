import{j as s,r as d,P as e,g as m,b as j,E as h,c as u}from"./index-ukl8PQQ5.js";import{p as l}from"./utils-lH8rWIzN.js";import{u as p}from"./useQuery-DAi6grm3.js";const o=()=>s.jsx("span",{role:"img","aria-label":"Green check mark",children:"✅"}),c=()=>s.jsx("span",{role:"img","aria-label":"Red cross mark",children:"❌"}),x=({users:n,startPolling:r,stopPolling:t})=>(d.useEffect(()=>(r(6e5),()=>{t()}),[r,t]),s.jsx("section",{className:"table-responsive",children:s.jsxs("table",{className:"table text-light",children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{scope:"col",children:"Email"}),s.jsx("th",{scope:"col",children:"Is administrator?"}),s.jsx("th",{scope:"col",children:"Is active?"}),s.jsx("th",{scope:"col",children:"Registration date"}),s.jsx("th",{scope:"col",children:"Last login"})]})}),s.jsx("tbody",{children:n.map(i=>s.jsxs("tr",{children:[s.jsx("td",{children:i.email}),s.jsx("td",{children:i.isAdmin?s.jsx(o,{}):s.jsx(c,{})}),s.jsx("td",{children:i.isActive?s.jsx(o,{}):s.jsx(c,{})}),s.jsx("td",{children:l(i.registrationDate)}),s.jsx("td",{children:l(i.lastLogin)})]},i.uuid))})]})}));x.propTypes={users:e.arrayOf(e.shape({email:e.string.isRequired,uuid:e.string.isRequired,isAdmin:e.bool.isRequired,isActive:e.bool.isRequired,registrationDate:e.string.isRequired,lastLogin:e.string.isRequired})),startPolling:e.func.isRequired,stopPolling:e.func.isRequired};const g=m`
query listAllUsers{
	listAllUsers{
		email,
		isAdmin,
		isActive
		registrationDate
		lastLogin
		uuid
	}
}
`,f=()=>{const{loading:n,error:r,data:t,startPolling:i,stopPolling:a}=p(g,{fetchPolicy:"no-cache"});return n?s.jsx(j,{}):r?s.jsx(h,{errorMessage:r.message}):s.jsx(x,{users:t.listAllUsers,startPolling:i,stopPolling:a})},A=()=>s.jsxs(d.Fragment,{children:[s.jsx(u,{text:"User administration panel"}),s.jsx(f,{})]});A.displayName="UserAdministration";export{A as default};
