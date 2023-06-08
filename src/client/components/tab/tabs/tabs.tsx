import React from "react"
import TabTitle from "../tab-title/tab-title"
import './tabs.scss'
import Swipeable from "../../shared/swipeable"
import { useSelector } from "react-redux"
import { reduxStore } from "../../../../shared/store"
import { setActiveTabIndex } from "../../../../shared/actions/app-navigation-action"
import { State } from "../../../../shared/reducers/index-reducer"


interface TabsProps {
  children: React.ReactElement[] | React.ReactElement
  titles: string[]
}

export default function Tabs(props: TabsProps): JSX.Element { 
  const activeTabIndex = useSelector((state: State) => state.appNavigation.activeTabIndex)

  return (
    <div className="tabs">
      <div className='tabs-bar' role='tablist'>
        <div className='tabs-bar__tab-titles'>
          {React.Children.map(props.children, (child, index) => {
            if (!React.isValidElement(child)) {
              return
            }
            const isSelected = activeTabIndex === index
            const title = props.titles[index]
            return (
              <TabTitle 
                key={title} 
                title={title} 
                isSelected={isSelected} 
                onClick={() => setActiveOutput(index, isSelected)}/>
              )
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

function setActiveOutput(tabIndex: number, isSelected: boolean): void {
  if (!isSelected) {
    reduxStore.dispatch(setActiveTabIndex(tabIndex))
  }
}
