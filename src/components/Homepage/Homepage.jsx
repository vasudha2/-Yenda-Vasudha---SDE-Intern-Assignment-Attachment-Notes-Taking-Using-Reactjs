import React, { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { ChromePicker } from 'react-color';
import './Homepage.css';

function Homepage() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [embedCode, setEmbedCode] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const videoRef = useRef(null);
  const [notes, setNotes] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [editNote, setEditNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:8081/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        localStorage.setItem('notes', JSON.stringify(data));
      } else {
        console.error('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
    setTitle('');
    setDescription('');
    setVideoLink('');
    setImageLink('');
    setMediaType(null);
    setEmbedCode('');
    setBackgroundColor('#FFFFFF');
    setEditNote(null);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const htmlToPlainText = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleVideoLinkChange = (event) => {
    const newLink = event.target.value;
    setMediaType(null);

    if (videoRef.current) {
      videoRef.current.src = '';
    }

    setVideoLink(newLink);

    if (isValidYouTubeLink(newLink)) {
      setMediaType('youtube');
      const videoId = extractYouTubeVideoId(newLink);
      setEmbedCode(
        `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
      );
    }
  };

  const handleImageLinkChange = (event) => {
    const newLink = event.target.value;
    setImageLink(newLink);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.hex);
  };

  const handleAddMedia = () => {
    if (isValidYouTubeLink(videoLink)) {
    } else if (isValidImageLink(imageLink)) {
      setMediaType('image');
    } else {
      alert(
        'Invalid link. Please provide a valid YouTube video link or image link.'
      );
    }
  };

  const handleCardClick = (note) => {
    setEditNote(note);
  };

  const handleDeleteNote = (note) => {
    const updatedNotes = notes.filter((n) => n !== note);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const handleEditNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setVideoLink(note.videoLink);
    setImageLink(note.imageLink);
    setMediaType(note.mediaType);
    setEmbedCode(note.embedCode);
    setBackgroundColor(note.backgroundColor);
    setEditNote(note);
    setFormVisible(true);
  };

  const handleNoteSubmit = async (event) => {
    event.preventDefault();


    const newNote = {
      title,
      description,
      videoLink,
      imageLink,
      mediaType,
      embedCode,
      backgroundColor,
      createdAt: new Date().toISOString(), 
    };

    if (editNote) {
      const updatedNotes = notes.map((note) =>
        note === editNote ? { ...note, ...newNote } : note
      );
      setNotes(updatedNotes);
    } else {
      setNotes([...notes, newNote]);
    }

    setTitle('');
    setDescription('');
    setVideoLink('');
    setImageLink('');
    setMediaType(null);
    setEmbedCode('');
    setBackgroundColor('#FFFFFF');
    setEditNote(null);

    localStorage.setItem('notes', JSON.stringify(notes));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredAndSortedNotes = notes
    .filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: '1' }, { header: '2' }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'font',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'align',
    'link',
  ];

  const isValidYouTubeLink = (url) => {
    return (
      url.includes('youtube.com') || url.includes('youtu.be')
    );
  };

  const isValidImageLink = (url) => {
    return (
      url &&
      /^(https?|http):\/\/\S+\.(jpeg|jpg|gif|png)$/i.test(url) ||
      /^data:image\/jpeg;base64,/.test(url)
    );
  };

  const extractYouTubeVideoId = (url) => {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=))([^&\n?#]+)/
    );
    return (videoIdMatch && videoIdMatch[1]) || '';
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className='homepage-container'>
    <div className="homepage">
      <h1>Notes</h1>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="desc">Sort by Newest</option>
          <option value="asc">Sort by Oldest</option>
        </select>
      </div>

      <button className="floating-button" onClick={toggleForm}>
        {isFormVisible ? 'Close Form' : 'Add Note'}
      </button>

      {isFormVisible && (
        <div className={`form-container ${isFormVisible ? 'form-open' : ''}`}>
          <div className="form-scroll">
            <form className="note-form" onSubmit={handleNoteSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="title-input"
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <div className="text-editor">
                  <ReactQuill
                    value={description}
                    onChange={handleDescriptionChange}
                    modules={modules}
                    formats={formats}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Video Link:</label>
                <input
                  type="text"
                  value={videoLink}
                  onChange={handleVideoLinkChange}
                  className="link-input"
                />
                <button type="button" onClick={handleAddMedia}>
                  Add
                </button>
              </div>

              {mediaType === 'youtube' && (
                <div className="media-container">
                  <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                </div>
              )}

              <div className="form-group">
                <label>Image Link:</label>
                <input
                  type="text"
                  value={imageLink}
                  onChange={handleImageLinkChange}
                  className="link-input"
                />
                <button type="button" onClick={handleAddMedia}>
                  Add
                </button>
              </div>

              {mediaType === 'image' && (
                <div className="media-container">
                  <img src={imageLink} alt="Description of the image" />
                </div>
              )}

              <div className="form-group">
                <label>Select Background Color:</label>
                <ChromePicker
                  color={backgroundColor}
                  onChangeComplete={(color) => handleBackgroundColorChange(color)}
                />
              </div>

              <button type="submit">{editNote ? 'Update' : 'Submit'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="notes-container">
        {filteredAndSortedNotes.map((note, index) => (
          <div
            className="note-card"
            key={index}
            style={{ backgroundColor: note.backgroundColor }}
          >
            <h2>{note.title}</h2>
            <div className="note-description">
              {htmlToPlainText(note.description)}
            </div>
            {note.mediaType === 'image' && (
              <div className="media-container">
                <img src={note.imageLink} alt="Description of the image" />
              </div>
            )}
            {note.mediaType === 'youtube' && (
              <div className="media-container">
                <div dangerouslySetInnerHTML={{ __html: note.embedCode }} />
              </div>
            )}
            <div className="note-time">
              {new Date(note.createdAt).toLocaleString()}
            </div>
            <div className="note-actions">
              <button onClick={() => handleEditNote(note)}>Edit</button>
              <button onClick={() => handleDeleteNote(note)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
    </div>
  );
}

export default Homepage;
