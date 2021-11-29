import React from 'react'

const ExpandButton = ({expand=false,onClick=null})=>{
    return(<button className="btn-ico-2" onClick={onClick}>
        {expand?
            <span className="material-icons">
            arrow_drop_down
            </span>:
            <span className="material-icons">
            arrow_drop_up
            </span>
        }
    </button>)
}

const ContactInfo = ({contact,switchContacts})=>{
    return(
        <div className="contactListItem"onClick={switchContacts}>
            <div className="d-flex align-items-center px-4"style={{
                height:'100%',width:'100%'
            }}>
                <img src={contact.image===null?Image:contact.image} 
            className="ms-md-1 avatar-small me-2" alt="profile pic" />
                <div className="d-flex flex-column mx-md-2 textArea"
                style={{minWidth:'30%',width:'180px'}}>
                    <div className="hidableText pt-1 fs-6" style={{fontSize: "17px",height:'30px'}}>{contact.name}</div>
                </div>
            </div>
            
        </div>
    )
}

const RoomInfo = ({contact,switchContacts})=>{
    return(
        <div className="contactListItem"onClick={switchContacts}>
            <div className="d-flex align-items-center px-4"style={{
                height:'100%',width:'100%'
            }}>
                <div className="d-flex flex-column mx-md-2 textArea"
                style={{minWidth:'30%',width:'180px'}}>
                    <div className="hidableText pt-1 fs-6" style={{fontSize: "17px",height:'30px'}}>{contact.name}</div>
                </div>
            </div>
            
        </div>
    )
}

const ExpandableContainer = function({children,text}){
    const [expand, setExpand] = React.useState(true)
    return (
        <div className="ps-1 py-3">
            <div className="d-flex align-items-center">
                <ExpandButton expand={expand}onClick={()=>setExpand(!expand)}/>
                <div className="hidableText ps-1 fs-5">{text}</div>
            </div>
            
            {expand&&children}
        </div>
    )
}

export {
    ContactInfo,
    ExpandableContainer,
    ExpandButton,
    RoomInfo
}