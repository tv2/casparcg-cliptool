import React from "react";
import '../../css/Settings.css'

export enum SettingsInputType {
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  NUMBER = 'number'
}

interface SettingsInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string | boolean | number
  type: SettingsInputType
  preDescription: string
  postDescription?: string
}

export default function SettingsInput(props: SettingsInputProps): JSX.Element {
  switch (props.type) {
    case SettingsInputType.TEXT:
    case SettingsInputType.NUMBER: {
      return (
        <label className="Settings-input-field">
          {props.preDescription}
          <br />
          <input 
            type={props.type}
            value={String(props.value)}
            onChange={props.onChange}
          />
          {props.postDescription ?? ''}
        </label>
      )
    }
    case SettingsInputType.CHECKBOX: {
      return (
        <label className="Settings-tick-field">
          {props.preDescription}
          <br />
          <input 
            type={props.type}
            checked={Boolean(props.value)}
            onChange={props.onChange}
          />
        </label>
      )
    }
  }
}
