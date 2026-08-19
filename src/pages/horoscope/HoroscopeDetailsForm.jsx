import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../../components/SEO';
import { getHoroscopeProduct } from '../../data/horoscopeProducts';
import { searchCities } from '../../utils/horoscopeCities';

const emptyPerson = () => ({
    name: '',
    dob: '2000-01-01',
    tob: '12:00',
    timeUnknown: false,
    gender: 'male',
    place: '',
    lat: '',
    lon: '',
    tz: ''
});

const PlaceField = ({ person, setPerson, idPrefix }) => {
    const [query, setQuery] = useState(person.place || '');
    const [matches, setMatches] = useState([]);
    const [showManual, setShowManual] = useState(false);

    const onInput = (e) => {
        const val = e.target.value;
        setQuery(val);
        setPerson((p) => ({ ...p, place: val, lat: '', lon: '', tz: '' }));
        setMatches(searchCities(val));
    };

    const pick = (city) => {
        const [name, region, lat, lon, tz] = city;
        const place = `${name}, ${region}`;
        setQuery(place);
        setMatches([]);
        setPerson((p) => ({ ...p, place, lat, lon, tz }));
    };

    return (
        <div className="field col-span relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Place of birth
            </label>
            <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    required
                    value={query}
                    onChange={onInput}
                    autoComplete="off"
                    placeholder="Start typing a city..."
                    className="w-full bg-gray-50 border border-gray-200 pl-9 pr-4 p-3.5 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                />
            </div>
            {matches.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {matches.map((c) => (
                        <button
                            type="button"
                            key={`${c[0]}-${c[1]}`}
                            onClick={() => pick(c)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gold/10 border-b border-gray-50 last:border-0"
                        >
                            <span className="font-medium text-charcoal">{c[0]}</span>
                            <span className="text-gray-400 text-xs ml-1">{c[1]}</span>
                        </button>
                    ))}
                </div>
            )}
            {person.lat !== '' ? (
                <p className="text-xs text-gray-500 mt-2">
                    ✓ {Number(person.lat).toFixed(4)}° {Number(person.lon).toFixed(4)}° · UTC{person.tz >= 0 ? '+' : ''}{person.tz}
                </p>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowManual((s) => !s)}
                    className="text-xs text-gold underline mt-2"
                >
                    Can't find your city? Enter coordinates manually
                </button>
            )}
            {showManual && person.lat === '' && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                    <input type="number" step="any" placeholder="Latitude" id={`${idPrefix}-lat`}
                        onChange={(e) => setPerson((p) => ({ ...p, lat: e.target.value }))}
                        className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-gold" />
                    <input type="number" step="any" placeholder="Longitude" id={`${idPrefix}-lon`}
                        onChange={(e) => setPerson((p) => ({ ...p, lon: e.target.value }))}
                        className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-gold" />
                    <input type="number" step="any" placeholder="UTC offset" id={`${idPrefix}-tz`}
                        onChange={(e) => setPerson((p) => ({ ...p, tz: e.target.value }))}
                        className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
            )}
        </div>
    );
};

const PersonFields = ({ title, person, setPerson, idPrefix }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="font-heading text-lg mb-6 text-charcoal">{title}</h2>
        <div className="form-grid grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="field col-span sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full name</label>
                <input
                    required
                    type="text"
                    value={person.name}
                    onChange={(e) => setPerson((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                    placeholder="Full name"
                />
            </div>
            <div className="field">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Date of birth</label>
                <input
                    required
                    type="date"
                    value={person.dob}
                    onChange={(e) => setPerson((p) => ({ ...p, dob: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                />
            </div>
            <div className="field">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Time of birth</label>
                <input
                    type="time"
                    disabled={person.timeUnknown}
                    value={person.tob}
                    onChange={(e) => setPerson((p) => ({ ...p, tob: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm disabled:opacity-50"
                />
                <label className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <input
                        type="checkbox"
                        checked={person.timeUnknown}
                        onChange={(e) => setPerson((p) => ({ ...p, timeUnknown: e.target.checked }))}
                    />
                    I don't know the exact time (chart cast for noon)
                </label>
            </div>
            <div className="field">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Gender</label>
                <select
                    value={person.gender}
                    onChange={(e) => setPerson((p) => ({ ...p, gender: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="na">Prefer not to say</option>
                </select>
            </div>
            <PlaceField person={person} setPerson={setPerson} idPrefix={idPrefix} />
        </div>
    </div>
);

const HoroscopeDetailsForm = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const product = getHoroscopeProduct(productId);

    const [subject, setSubject] = useState(emptyPerson());
    const [partner, setPartner] = useState(emptyPerson());
    const [contact, setContact] = useState({ email: '', phone: '' });
    const [error, setError] = useState('');

    if (!product) {
        return (
            <div className="min-h-screen pt-32 text-center bg-gray-50 flex flex-col items-center justify-center px-6">
                <h2 className="text-2xl font-heading mb-4 text-charcoal">That reading doesn't exist.</h2>
                <Link to="/horoscope" className="btn-primary bg-charcoal text-white hover:bg-gold hover:text-charcoal">
                    View readings
                </Link>
            </div>
        );
    }

    const isMatch = product.mode === 'match';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (subject.lat === '' || subject.lon === '' || subject.tz === '') {
            setError('Please pick a place of birth from the list, or enter coordinates manually.');
            return;
        }
        if (isMatch && (partner.lat === '' || partner.lon === '' || partner.tz === '')) {
            setError("Please pick your partner's place of birth from the list, or enter coordinates manually.");
            return;
        }
        navigate(`/horoscope/${productId}/payment`, {
            state: {
                subject,
                partner: isMatch ? partner : null,
                contact
            }
        });
    };

    return (
        <div className="min-h-screen bg-ivory/50 pt-28 pb-12">
            <SEO
                title={`${product.name} - Enter Birth Details | Ayodhya Agarbatti`}
                description={product.tagline}
                canonical={`https://www.ayodhyaagarbatti.in/horoscope/${productId}/details`}
                ogType="website"
            />
            <div className="max-w-3xl mx-auto px-6">
                <Link to="/horoscope" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold mb-6">
                    <ArrowLeft size={14} /> Back to readings
                </Link>
                <h1 className="font-serif text-3xl text-charcoal mb-2">{product.name}</h1>
                <p className="text-gray-500 mb-8">Enter birth details to compute the chart. ₹{product.price}.</p>

                <form onSubmit={handleSubmit}>
                    <PersonFields
                        title={isMatch ? "Groom's birth details" : 'Birth details'}
                        person={subject}
                        setPerson={setSubject}
                        idPrefix="subject"
                    />

                    {isMatch && (
                        <PersonFields
                            title="Bride's birth details"
                            person={partner}
                            setPerson={setPartner}
                            idPrefix="partner"
                        />
                    )}

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <h2 className="font-heading text-lg mb-6 text-charcoal">Contact details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="field">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={contact.email}
                                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                                    placeholder="email@address.com"
                                />
                            </div>
                            <div className="field">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                                <input
                                    required
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-charcoal text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                        Continue to Payment <ArrowRight size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HoroscopeDetailsForm;
