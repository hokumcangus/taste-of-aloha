import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSnacks } from '../store/slices/snackSlice';

const Menu = () => {
    const dispatch = useDispatch();
    const { snacks, loading, error } = useSelector((state) => state.snacks);
    useEffect(() => {
        dispatch(fetchSnacks());
    }, [dispatch]);

    if (loading) {
        return (
            <div style={{ 
                padding: '2rem', 
                textAlign: 'center' 
            }}>
                <h1>Menu</h1>
                <p>Loading snacks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                padding: '2rem', 
                textAlign: 'center' 
            }}>
                <h1>Menu</h1>
                <p style={{ color: 'red' }}>Error: {error}</p>
                <button onClick={() => dispatch(fetchSnacks())}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <h1 style={{ 
                fontSize: '2.5rem', 
                marginBottom: '2rem',
                color: '#333'
            }}>
                Menu
            </h1>
            
            {snacks.length === 0 ? (
                <p style={{ 
                    fontSize: '1.2rem', 
                    color: '#666',
                    marginTop: '2rem'
                }}>
                    No snacks available. Check back later!
                </p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '2rem'
                }}>
                    {snacks.map((snack) => (
                        <div 
                            key={snack.id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <h3 style={{ 
                                margin: '0 0 0.5rem 0',
                                color: '#333',
                                fontSize: '1.5rem'
                            }}>
                                {snack.name}
                            </h3>
                            {snack.price && (
                                <p style={{ 
                                    margin: '0.5rem 0',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#646cff'
                                }}>
                                    ${snack.price.toFixed(2)}
                                </p>
                            )}
                            {snack.description && (
                                <p style={{ 
                                    margin: '0.5rem 0 0 0',
                                    color: '#666',
                                    fontSize: '0.9rem'
                                }}>
                                    {snack.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;    