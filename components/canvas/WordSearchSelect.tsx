import React from "react"
import AsyncSelect from "react-select/async"
import { debounce } from "lodash"
import { OptionType } from "./utils"

interface WordSearchSelectProps {
  placeholder?: string
  onChange: (selectedOption: any) => void
  value: OptionType | undefined
}

const WordSearchSelect: React.FC<WordSearchSelectProps> = ({
  placeholder,
  onChange,
  value,
}) => {
  const loadOptions = (
    inputValue: string,
    callback: (options: OptionType[]) => void
  ) => {
    fetch(`/api/words/search?text=${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((word: string) => ({
          label: word,
          value: word,
        }))
        callback(options)
      })
  }

  const debouncedLoadOptions = debounce(loadOptions, 500)

  const customStyles = {
    menu: (provided: any) => ({ ...provided, zIndex: 9999 }),
  }

  return (
    <AsyncSelect<OptionType>
      loadOptions={debouncedLoadOptions}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      styles={customStyles}
    />
  )
}

export default WordSearchSelect
