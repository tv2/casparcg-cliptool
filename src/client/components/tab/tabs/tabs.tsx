import React from "react"
import TabTitle from "../tab-title/tab-title"
import './tabs.scss'
import Swipeable from "../../shared/swipeable"
import { useSelector } from "react-redux"
import { State } from "../../../../model/reducers/index-reducer"


interface TabsProps {
  children: React.ReactElement[] | React.ReactElement
  titles: string[]
}

export default function Tabs(props: TabsProps): JSX.Element { 
  const activeTabIndex = useSelector((state: State) => state.appNavigation.activeTabIndex)

  return (
    <div className="tabs">
      <div className='tabs-bar' role='tablist'>
        <div className='tabs-bar__tabs'>
          {React.Children.map(props.children, (child, index) => {
            if (!React.isValidElement(child)) {
              return
            }
            return (<TabTitle key={index} title={props.titles[index]} tabIndex={index}/>)
          })}        
        </div>
      </div>
      {Array.isArray(props.children) 
        ?  (<Swipeable 
            activeChild={activeTabIndex} 
            role="tabpanel">
              {props.children}
            </Swipeable>) 
        : props.children}
    </div>
  )
}