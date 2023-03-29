import React from "react"
import { useSelector } from "react-redux"
import { ReduxStateType } from "../../../model/reducers/indexReducer"
import appNavigationService from "../../../model/services/app-navigation-service"
import { TabProps } from "./tab"
import TabTitle from "./tab-title"
import '../../css/Tab.css'

interface TabsProps {
  // TODO: figure out how to apply the correct type identifier such that only 'Tab' components are allowed. 
  children: React.ReactElement[] | React.ReactElement
}

export default function Tabs(props: TabsProps): JSX.Element {   
  const selectedTab: number = 
    useSelector((storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate.appNavigation))

  return (
    <div>
      <div className='tabs-bar' role='tablist'>
        <div className='tabs-bar__tabs'>
          {React.Children.map(props.children, (child, index) => {
            if (!React.isValidElement(child)) {
              return
            }
            const childProps = child.props as any as TabProps
            return (<TabTitle key={index} title={childProps.title} tabIndex={index} selectedTab={selectedTab}/>)
          })}        
        </div>
      </div>
      {Array.isArray(props.children) ? props.children[selectedTab] : props.children}
    </div>
  )
}