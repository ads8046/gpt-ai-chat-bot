import { useState, useEffect } from "react";

const App = () => {
    const [value, setValue] = useState(null);
    const [message, setMessage] = useState(null);
    const [prevChats, setPrevChats] = useState([]);
    const [currTitle, setCurrTitle] = useState(null);

    const getMessages = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const resp = await fetch(
                "http://localhost:8000/completions",
                options
            );
            const data = await resp.json();
            setMessage(data.choices[0].message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSendButton = () => {
        getMessages();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && value) {
            getMessages();
        }
    };

    const handleHistoryItemClick = (uniqueTitle) => {
        setCurrTitle(uniqueTitle);
    };

    const createNewChat = () => {
        setMessage(null);
        setValue("");
        setCurrTitle(null);
    };

    useEffect(() => {
        console.log(currTitle, value, message);
        if (!currTitle && value && message) {
            setCurrTitle(value);
        }
        if (currTitle && value && message) {
            setPrevChats((prevChats) => [
                ...prevChats,
                {
                    title: currTitle,
                    role: "user",
                    content: value,
                },
                {
                    title: currTitle,
                    role: message.role,
                    content: message.content,
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, currTitle]);

    console.log(prevChats);

    const currChat = prevChats.filter(
        (prevChat) => prevChat.title === currTitle
    );

    const uniqueTitles = Array.from(
        new Set( prevChats.map((prevChat) => prevChat.title) )
    );

    return (
        <div className="app">
            <section className="side-bar">
                <button onClick={createNewChat}>+ New Chat</button>
                <h3 id={"chats-header"}>Chats</h3>
                <ul className={"history"}>
                    {uniqueTitles?.map((uniqueTitle, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                handleHistoryItemClick(uniqueTitle);
                            }}
                        >
                            {uniqueTitle}
                        </li>
                    ))}
                </ul>
                <nav>
                    <p id={"built-by"}>
                        Built with 💛 by Atharva Shivankar in Rochester NY
                    </p>
                </nav>
            </section>

            <section className="main">
                {!currTitle && <h1>LuminaAI 💡</h1>}
                <ul className={"feed"}>
                    {currChat?.map((chatMessage, index) => (
                        <li key={index}>
                            <p className={"role"}>{chatMessage.role}</p>
                            <p>{chatMessage.content}</p>
                        </li>
                    ))}
                </ul>

                <div className={"bottom-section"}>
                    <div className={"input-container"}>
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div id="submit" onClick={handleSendButton}>
                            ➢
                        </div>
                    </div>
                    <p className={"info"}>
                        A ChatGPT clone application, powered by OpenAI API.
                        Developed By Atharva Shivankar. Personal project for
                        experimenting with OpenAI's models and API endpoints,
                        not intended for commercial use.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default App;
