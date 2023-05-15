import { Modal, NumberInput } from '@mantine/core'
import { useAtom } from 'jotai'
import React from 'react'
import { settingsAtom } from '../state'

const SettingsModal = ({ opened, close }) => {
  const [settings, setSettings] = useAtom(settingsAtom)

  return (
    <Modal opened={opened} onClose={close}>
      <h2>Settings</h2>

      <NumberInput
        value={settings.foodCount}
        label={'Food count'}
        onChange={(value) => {
          setSettings((settings) => ({
            ...settings,
            foodCount: value,
          }))
        }}
      />
      <NumberInput
        value={settings.waterCount}
        label={'Water count'}
        onChange={(value) => {
          setSettings((settings) => ({
            ...settings,
            waterCount: value,
          }))
        }}
      />
      <NumberInput
        value={settings.wallCount}
        label={'Wall count'}
        onChange={(value) => {
          setSettings((settings) => ({
            ...settings,
            wallCount: value,
          }))
        }}
      />
      <NumberInput
        value={settings.size}
        label={'Grid size'}
        onChange={(value) => {
          setSettings((settings) => ({
            ...settings,
            size: value,
          }))
        }}
      />
      <NumberInput
        value={settings.reward}
        label={'Food reward'}
        onChange={(value) => {
          setSettings((settings) => ({
            ...settings,
            reward: value,
          }))
        }}
      />
      <NumberInput
        value={settings.penalty}
        label={'Wall hit penalty'}
        onChange={(value) => {
          setSettings((settings) => ({
            ...settings,
            penalty: value,
          }))
        }}
      />
      <NumberInput
        value={settings.playerViewDistance}
        label={'Player view distance'}
        onChange={(value) => {
          setSettings((settings) => ({
            ...settings,
            playerViewDistance: value,
          }))
        }}
      />
      <NumberInput
        value={settings.maxAge}
        label={'Max age ( win condition )'}
        onChange={(value) => {
          setSettings((settings) => ({
            ...settings,
            maxAge: value,
          }))
        }}
      />
    </Modal>
  )
}

export default SettingsModal
