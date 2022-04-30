import axios from 'axios'
import React, { useState, useEffect } from 'react'
import charactersService from './services/charactersService'
import Notification from './components/Notification'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './index.css';

//Components

const AddCharacterForm = ({addCharacter, newCharacter, handleNameChange, handleClassChange, handleLevelChange, handleItemLevelChange, classes}) => {
    console.log(classes)
    return(
        <div>
            <form onSubmit={addCharacter}>
                <div>
                    name: <input value={newCharacter.name} onChange={handleNameChange} />
                </div>
                <div>
                    <label htmlFor="classes-select">Choose character's class:</label>
                    <select name="classes" id="classes-select" onChange={handleClassChange}>
                        {classes.map((classe) => {
                            console.log(classe)
                            return(
                                <option key={classe.id} value={classe.name}>{classe.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    level: <input value={newCharacter.level} onChange={handleLevelChange} />
                </div>
                <div>
                    itemLevel: <input value={newCharacter.itemLevel} onChange={handleItemLevelChange} />
                </div>
                <div>
                    <button type="submit">Add Character</button>
                </div>
            </form>
        </div>
    )
}

const Character = ({character, handleUna1DoneChange, updateCharacter}) => {
    console.log(character)
    console.log(character.itemLevel)
    return(
        <form onSubmit={updateCharacter(character.id)}>
            <div>
                <h2>{character.name}</h2>
                <p>Class : {character.class}</p>
                <p>itemLevel : {character.itemLevel}</p>
                <p>Level : {character.level}</p>

                <h3>Controle Semanal/Diário</h3>
                <WeeklyDailyControl character={character} handleUna1DoneChange={handleUna1DoneChange} />
            </div>
            <div>
                <button type='submit'>Update</button>
            </div>
        </form>
    )
}

const WeeklyDailyControl = ({character, handleUna1DoneChange}) => {
    console.log(character)
    if(character.Una1){
        return(
            <div>
                <input type="checkbox" id="Una1" name={character.Una1.name} value={character.Una1.Done} checked={character.Una1.Done} onChange={handleUna1DoneChange(character.id)} />
                <label htmlFor="Una1">{character.Una1.name}</label>
            </div>
        )
    }
}

const CharacterOverview = ({characters, handleUna1DoneChange, updateCharacter}) => {
    return(
        <div>
            {characters.map(char => {
                return(
                    <Character key={char.name} character={char} handleUna1DoneChange={handleUna1DoneChange} updateCharacter={updateCharacter} />
                )
            })}
        </div>
    )
}

const TabsComponent = ({addCharacter, handleTabClicked, updateCharacter, newCharacter, handleNameChange, handleClassChange, handleLevelChange, handleItemLevelChange, handleUna1DoneChange, classes, characters}) => {
    return(
        <div className="tabs">
            <div className='addCharacterTabWrapper'>
                <button id="addCharacterTab" className="tabButton" onClick={handleTabClicked("addCharacter")}>Add Character</button>
            </div>
            <div className='characterOverviewTabWrapper'>
                <button id="characterOverviewTab" className="tabButton" onClick={handleTabClicked("characterOverview")}>CharacterOverview</button>
            </div>        
        </div>
    )
}


const App = () => {
    const [classes, setClasses] = useState([])

    const [characters, setCharacters] = useState([])
    const [newCharacter, setNewCharacter] = useState({
        name: '', class: '', level: 0, itemLevel: 0
    })
    const [notificationMessage, setNotificationMessage] = useState(null)

    
    useEffect(() => {
        console.log('effect')
        charactersService.getAll()
        .then(allCharacters => {
            console.log(allCharacters)
            setCharacters(allCharacters)
        })
        .catch(error => {
            alert(`fail`)
        })
        axios.get("http://localhost:3001/classes")
        .then(response => {
            const dbClasses = response.data
            console.log(dbClasses)
            setClasses(dbClasses)
        })
        .catch(error =>
            alert(`fail`)
        )
    },[])

    const handleTabClicked = (tabName) => {
        const handleClickCallback = (event) => {
            console.log(event.target.className)
            return "opa"
        }
        return handleClickCallback
    }

    const addCharacter = (event) => {
        event.preventDefault()
        charactersService.getAll()
        .then(dbCharacters => {
            const dbNames = dbCharacters.map(character => character.name)
            if(dbNames.includes(newCharacter.name)) { // name already in database
                console.log("nome já existe na base de dados")
                setNotificationMessage('Name already exists in database', false)
                setTimeout(() => {
                    setNotificationMessage(null)
                }, 5000)
            }
            else { //name not in database
                const newCharacterObject = {
                    name: newCharacter.name,
                    class: newCharacter.class,
                    level: newCharacter.level,
                    itemLevel: newCharacter.itemLevel
                }
                charactersService.createCharacter(newCharacterObject)
                    .then(newCharacter => {
                        console.log('promise fullfilled')
                        setCharacters(characters.concat(newCharacter))
                        setNewCharacter({
                            name: '', class: '', level: 0, itemLevel: 0
                        })
                        setNotificationMessage('Added new character', false)
                        setTimeout(() => {
                            setNotificationMessage(null)
                        }, 5000)
                    })
                    .catch(error => {
                        alert(
                            `fail`
                        )
                        setNotificationMessage('error', true)
                        setTimeout(() => {
                            setNotificationMessage(null)
                        }, 5000)
                    })
            }
        })
    }

    const updateCharacter = (id) => {
        const updateCharacterCallback = (event) => {
            event.preventDefault()
            const changedCharacter = characters.find(char => char.id === id)
            charactersService.updateCharacter(id, changedCharacter)
            .then(ChangedChar => {
                console.log("premise fullfilled")
                console.log(changedCharacter)
            })
            .catch(error => {
                alert(`fail`)
            })
        }
        return updateCharacterCallback
    }

    const handleNameChange = (event) => {
        setNewCharacter({...newCharacter, name: event.target.value})
    }
    const handleClassChange = (event) => {
        setNewCharacter({...newCharacter, class: event.target.value})
    }
    const handleLevelChange = (event) => {
        setNewCharacter({...newCharacter, level: event.target.value})
    }
    const handleItemLevelChange = (event) => {
        setNewCharacter({...newCharacter, itemLevel: event.target.value})
    }

    const handleUna1DoneChange = (id) => { 
        console.log(id)
        const handleChangeCallback = (event) => {
            const character = characters.find(char => char.id === id)
            const changedCharacter = {...character, Una1:{...character.Una1, Done: event.target.checked}}
            setCharacters(characters.map(char => char.id !== id ? char : changedCharacter))
        }
        return handleChangeCallback
    }
    

    return (
        <>
            <Notification message={notificationMessage} />
            <TabsComponent handleTabClicked={handleTabClicked} addCharacter={addCharacter} updateCharacter={updateCharacter} classes={classes} newCharacter={newCharacter} handleNameChange={handleNameChange} handleClassChange={handleClassChange} handleLevelChange={handleLevelChange} handleItemLevelChange={handleItemLevelChange} handleUna1DoneChange={handleUna1DoneChange} characters={characters}/>
        </>
    )
}

export default App;
