import React from "react"
import { useSelector } from "react-redux"
import { State } from "../../../../model/reducers/index-reducer"
import appNavigationService from "../../../../model/services/app-navigation-service"
import { TabProps } from "../tab/tab"
import TabTitle from "../tab-title/tab-title"
import './tabs.scss'


interface TabsProps {
  // TODO: figure out how to apply the correct type identifier such that only 'Tab' components are allowed. 
  children: React.ReactElement[] | React.ReactElement
}

export default function Tabs(props: TabsProps): JSX.Element {   
  const activeTabIndex: number = 
    useSelector((state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))

  return (
    <div className="tabs">
      <div className='tabs-bar' role='tablist'>
        <div className='tabs-bar__tabs'>
          {React.Children.map(props.children, (child, index) => {
            if (!React.isValidElement(child)) {
              return
            }
            const childProps = child.props as any as TabProps
            return (<TabTitle key={index} title={childProps.title} tabIndex={index} selectedTab={activeTabIndex}/>)
          })}        
        </div>
      </div>
      {Array.isArray(props.children) ? props.children[activeTabIndex] : props.children}
    </div>
  )
}