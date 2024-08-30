

function Homepage(){
    useEffect(
        () => {
            //delete previouse user if exist
            if(localStorage.getItem("currentUser"))
                localStorage.setItem("currentUser", null)
        }, []
    )
}