const AuthLayout=({
    children
}:{
    children:React.ReactNode
})=>{
    return (
        <div style={{display:"flex", alignItems:"center",justifyContent:"center", height:"screen"}}>
            {children}
        </div>
    )
}

export default AuthLayout