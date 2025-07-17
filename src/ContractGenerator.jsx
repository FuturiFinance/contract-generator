import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Download, Check, X, Search, Tv, Radio, MoreHorizontal, Plus, Trash2, Mail } from 'lucide-react';

const ContractGenerator = () => {
  console.log("ContractGenerator mounted");
  // TV station data state
  const [tvStations, setTvStations] = useState([]);
  const [tvLoading, setTvLoading] = useState(true);
  const [tvError, setTvError] = useState(null);

  // Fetch TV station data from JSON file with error handling
  useEffect(() => {
    console.log("Fetching TV Stations");
    setTvLoading(true);
    setTvError(null);
    fetch('/data/TV Stations.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setTvStations(Array.isArray(data) ? data : []))
      .catch(error => {
        setTvError('Failed to load TV stations');
        setTvStations([]);
        console.error('Error loading TV stations:', error);
      })
      .finally(() => setTvLoading(false));
  }, []);

  // Radio station data - loading state
  const [radioStationData, setRadioStationData] = useState([]);
  const [radioDataLoading, setRadioDataLoading] = useState(false);
  const [radioDataError, setRadioDataError] = useState(null);

  // TV Product list
  const tvProducts = [
    "TopicPulse-TV",
    "TopicPulse w/ Instant Video-TV",
    "POST-TV",
    "TopLine-TV",
    "SpotOn-100-TV",
    "SpotOn-500-TV",
    "SpotOn-750-TV"
  ];

  // Radio Product list (from the rate card image)
  const radioProducts = [
    "TopicPulse",
    "TopicPulse w/ Instant Video",
    "POST",
    "Mobile 36",
    "Mobile 48",
    "Mobile 60",
    "Streaming",
    "Tether",
    "Prep+",
    "Instant Video add-on",
    "FAAi - Nights/Overnights/Weekends",
    "FAAi - 24/7",
    "FAAi - Daily Weather/News",
    "SpotOn Unlimited",
    "TopLine"
  ];

  // Radio rate card data (monthly rates based on AQH tiers)
  const radioRateCard = {
    "TopicPulse": {
      "7401+": 2000,
      "2901-7400": 1500,
      "901-2900": 1000,
      "0-900": 750
    },
    "TopicPulse w/ Instant Video": {
      "7401+": 3000,
      "2901-7400": 2250,
      "901-2900": 1500,
      "0-900": 1125
    },
    "POST": {
      "7401+": 2000,
      "2901-7400": 1500,
      "901-2900": 1000,
      "0-900": 750
    },
    "Mobile 36": {
      "7401+": 1175,
      "2901-7400": 925,
      "901-2900": 675,
      "0-900": 625
    },
    "Mobile 48": {
      "7401+": 1115,
      "2901-7400": 865,
      "901-2900": 615,
      "0-900": 565
    },
    "Mobile 60": {
      "7401+": 1075,
      "2901-7400": 825,
      "901-2900": 575,
      "0-900": 500
    },
    "Streaming": {
      "7401+": 775,
      "2901-7400": 475,
      "901-2900": 275,
      "0-900": 225
    },
    "Tether": {
      "7401+": 1000,
      "2901-7400": 750,
      "901-2900": 500,
      "0-900": 350
    },
    "Prep+": {
      "7401+": 775,
      "2901-7400": 550,
      "901-2900": 425,
      "0-900": 300
    },
    "Instant Video add-on": {
      "7401+": 1000,
      "2901-7400": 750,
      "901-2900": 500,
      "0-900": 375
    },
    "FAAi - Nights/Overnights/Weekends": {
      "7401+": 3900,
      "2901-7400": 2600,
      "901-2900": 1750,
      "0-900": 1500
    },
    "FAAi - 24/7": {
      "7401+": 5200,
      "2901-7400": 3900,
      "901-2900": 2150,
      "0-900": 1750
    },
    "FAAi - Daily Weather/News": {
      "7401+": 2000,
      "2901-7400": 1750,
      "901-2900": 1500,
      "0-900": 1250
    },
    "SpotOn Unlimited": {
      "all": 3750
    },
    "TopLine": {
      "all": 0 // Special calculation
    }
  };

  // State
  const [mediaType, setMediaType] = useState(null);
  const [paymentType, setPaymentType] = useState('cash'); // 'cash' or 'barter'
  const [stationInput, setStationInput] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedStations, setSelectedStations] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [contractDate, setContractDate] = useState(new Date().toISOString().split('T')[0]);
  const [contractTerm, setContractTerm] = useState('12');
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [contractVariations, setContractVariations] = useState([]);
  const [showFinalContract, setShowFinalContract] = useState(false);
  const [toplineUsers, setToplineUsers] = useState('');
  const [barterMinutes, setBarterMinutes] = useState({}); // {stationId: {prime: X, ros: Y}}
  const [selectedMarket, setSelectedMarket] = useState('');

  // --- RADIO OWNER & MARKET STATE ---
  const [selectedRadioOwner, setSelectedRadioOwner] = useState('');
  const [selectedRadioMarket, setSelectedRadioMarket] = useState('');

  // --- RADIO OWNERS ---
  const radioOwners = useMemo(() => {
    return [...new Set(radioStationData.map(s => s.owner))].sort();
  }, [radioStationData]);

  // --- RADIO MARKETS (filtered by owner) ---
  const radioMarkets = useMemo(() => {
    if (!selectedRadioOwner) return [];
    return [...new Set(radioStationData.filter(s => s.owner === selectedRadioOwner).map(s => s.market))].sort();
  }, [radioStationData, selectedRadioOwner]);

  // --- RADIO STATIONS BY OWNER & MARKET ---
  const radioStationsByOwnerMarket = useMemo(() => {
    if (!selectedRadioOwner) return [];
    return radioStationData.filter(s =>
      s.owner === selectedRadioOwner &&
      (!selectedRadioMarket || selectedRadioMarket === 'ALL' || s.market === selectedRadioMarket)
    );
  }, [radioStationData, selectedRadioOwner, selectedRadioMarket]);

  // Load radio data when radio is selected
  useEffect(() => {
    if (mediaType === 'Radio' && radioStationData.length === 0) {
      setRadioDataLoading(true);
      setRadioDataError(null);
      fetch('/data/Radio Stations.json')
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          // data is an object: { owner: [stations] }
          // Flatten to array of stations with owner field
          const stations = Object.entries(data).flatMap(([owner, arr]) =>
            arr.map(station => ({
              ...station,
              owner,
              market: station["Parent-Market"],
              station: station["Station"],
              format: station["Format"],
              primeAQH: parseInt((station["Prime AQH"] || '').replace(/,/g, '')) || 0,
              rosAQH: parseInt((station["ROS AQH"] || '').replace(/,/g, '')) || 0,
              preferredAQH: parseInt((station["Preferred AQH"] || '').replace(/,/g, '')) || 0
            }))
          );
          setRadioStationData(stations);
        })
        .catch(error => {
          setRadioDataError('Failed to load radio station data.');
          setRadioStationData([]);
          console.error('Error loading radio station data:', error);
        })
        .finally(() => setRadioDataLoading(false));
    }
  }, [mediaType]);

  // Get current station data based on media type
  const currentStationData = mediaType === 'TV' ? tvStations : radioStationData;
  const currentProducts = mediaType === 'TV' ? tvProducts : radioProducts;

  // Calculate value per minute for barter (daily basis)
  const calculateMinuteValue = (station, type = 'prime') => {
    const aqh = type === 'prime' ? station.primeAQH : station.rosAQH;
    const cpm = type === 'prime' ? 2 : 1.90;
    // Formula: ((AQH/1000)*CPM)*7)*2) for daily value
    return ((aqh / 1000) * cpm * 7 * 2);
  };

  // Calculate optimal barter minutes distribution (daily)
  const calculateOptimalBarterMinutes = (stations, targetValue) => {
    // Build all possible minute values for each station
    const maxMinutes = 10;
    const result = {};
    stations.forEach(station => { result[station.station] = { prime: 0, ros: 0 }; });
    let currentValue = 0;
    let round = 0;
    // Distribute minutes in rounds
    while (currentValue < targetValue && round < maxMinutes) {
      let addedThisRound = false;
      for (const station of stations) {
        // Only add if not at cap
        if (result[station.station].prime < maxMinutes || result[station.station].ros < maxMinutes) {
          const primeValue = calculateMinuteValue(station, 'prime') * 52;
          const rosValue = calculateMinuteValue(station, 'ros') * 52;
          // Prefer the higher value minute (if both available)
          let addType = null;
          if (result[station.station].prime < maxMinutes && result[station.station].ros < maxMinutes) {
            addType = primeValue >= rosValue ? 'prime' : 'ros';
          } else if (result[station.station].prime < maxMinutes) {
            addType = 'prime';
          } else if (result[station.station].ros < maxMinutes) {
            addType = 'ros';
          }
          if (addType) {
            // Check if adding this minute would go over 10% above target
            if (currentValue + (addType === 'prime' ? primeValue : rosValue) > targetValue * 1.10) {
              continue;
            }
            result[station.station][addType]++;
            currentValue += (addType === 'prime' ? primeValue : rosValue);
            addedThisRound = true;
            if (currentValue >= targetValue && currentValue <= targetValue * 1.10) {
              break;
            }
          }
        }
      }
      if (!addedThisRound) break;
      round++;
    }
    // If we're under target, try to add more minutes (even if it goes over, but not more than 10% over)
    let added = true;
    while (currentValue < targetValue && added) {
      added = false;
      for (const station of stations) {
        for (const type of ['prime', 'ros']) {
          if (result[station.station][type] < maxMinutes) {
            const value = calculateMinuteValue(station, type) * 52;
            if (currentValue + value > targetValue * 1.10) continue;
            result[station.station][type]++;
            currentValue += value;
            added = true;
            if (currentValue >= targetValue && currentValue <= targetValue * 1.10) break;
          }
        }
        if (currentValue >= targetValue && currentValue <= targetValue * 1.10) break;
      }
    }
    // Prune (remove) lowest-value minutes one by one, as long as total stays >= target
    const allMinutes = [];
    Object.entries(result).forEach(([station, types]) => {
      for (let t of ['prime', 'ros']) {
        for (let i = 0; i < types[t]; i++) {
          allMinutes.push({ station, type: t, value: calculateMinuteValue(stations.find(s => s.station === station), t) * 52 });
        }
      }
    });
    allMinutes.sort((a, b) => a.value - b.value); // ascending
    for (let i = 0; i < allMinutes.length; i++) {
      if (currentValue - allMinutes[i].value >= targetValue) {
        result[allMinutes[i].station][allMinutes[i].type]--;
        currentValue -= allMinutes[i].value;
      }
    }
    // If we still can't reach the target, max out all stations
    if (currentValue < targetValue) {
      stations.forEach(station => {
        result[station.station] = { prime: maxMinutes, ros: maxMinutes };
      });
    }
    return result;
  };

  // Calculate total barter value from minutes (daily input)
  const calculateBarterValueFromMinutes = (stations, minutes) => {
    return stations.reduce((total, station) => {
      const stationMinutes = minutes[station.station] || { prime: 0, ros: 0 };
      const primeValue = calculateMinuteValue(station, 'prime') * stationMinutes.prime * 52; // Daily to annual
      const rosValue = calculateMinuteValue(station, 'ros') * stationMinutes.ros * 52; // Daily to annual
      return total + primeValue + rosValue;
    }, 0);
  };

  // Get annual rate based on market rank/AQH and product
  const getRate = (station, product, numToplineUsers = null) => {
    if (mediaType === 'TV') {
      // TV rate calculation (existing logic)
      if (product === "TopLine-TV") {
        if (!numToplineUsers || numToplineUsers <= 0) return 0;
        const costPerResearch = 95;
        const avgPresentations = 3;
        const baseTotal = numToplineUsers * costPerResearch * (1 + avgPresentations); // No 85% adjustment
        const monthlyWithUpcharge = baseTotal * 1.25;
        const annualRate = (monthlyWithUpcharge * 12) + 3000; // $3K one-time fee for TV
        return annualRate;
      }
      
      // Standard TV rate calculation
      let tier;
      if (station.msaRankTV >= 1 && station.msaRankTV <= 25) {
        tier = "1-25";
      } else if (station.msaRankTV >= 26 && station.msaRankTV <= 75) {
        tier = "26-75";
      } else if (station.msaRankTV >= 76 && station.msaRankTV <= 125) {
        tier = "76-125";
      } else {
        tier = "126-1000";
      }
      
      const monthlyRates = {
        "TopicPulse-TV": { "1-25": 2500, "26-75": 2000, "76-125": 1750, "126-1000": 1250 },
        "TopicPulse w/ Instant Video-TV": { "1-25": 3750, "26-75": 3000, "76-125": 2625, "126-1000": 1875 },
        "POST-TV": { "1-25": 2500, "26-75": 2000, "76-125": 1750, "126-1000": 1250 },
        "TopLine-TV": { "1-25": 5000, "26-75": 4000, "76-125": 3000, "126-1000": 2000 },
        "SpotOn-100-TV": { "1-25": 950, "26-75": 950, "76-125": 950, "126-1000": 950 },
        "SpotOn-500-TV": { "1-25": 2325, "26-75": 2325, "76-125": 2325, "126-1000": 2325 },
        "SpotOn-750-TV": { "1-25": 3750, "26-75": 3750, "76-125": 3750, "126-1000": 3750 }
      };
      
      const monthlyRate = monthlyRates[product]?.[tier] || 0;
      return monthlyRate * 12;
    } else {
      // Radio rate calculation
      if (product === "TopLine") { // Radio TopLine
        if (!numToplineUsers || numToplineUsers <= 0) return 0;
        const costPerResearch = 95;
        const avgPresentations = 3;
        const baseTotal = numToplineUsers * costPerResearch * (1 + avgPresentations); // No 85% adjustment
        const monthlyWithUpcharge = baseTotal * 1.25;
        const annualRate = monthlyWithUpcharge * 12; // No $3K fee for radio
        return annualRate;
      }
      
      // Get AQH value (using Prime AQH as default)
      const aqh = station.primeAQH || 0;
      
      // Get rate structure for product
      const rateStructure = radioRateCard[product];
      if (!rateStructure) return 0;
      
      // If product has flat rate
      if (rateStructure.all) {
        const monthlyRate = rateStructure.all;
        const annualRate = monthlyRate * 12;
        // Apply barter upcharge if needed
        return paymentType === 'barter' ? annualRate * 1.35 : annualRate;
      }
      
      // Otherwise, find appropriate tier based on AQH
      let monthlyRate = 0;
      if (aqh >= 7401) {
        monthlyRate = rateStructure["7401+"] || 0;
      } else if (aqh >= 2901) {
        monthlyRate = rateStructure["2901-7400"] || 0;
      } else if (aqh >= 901) {
        monthlyRate = rateStructure["901-2900"] || 0;
      } else {
        monthlyRate = rateStructure["0-900"] || 0;
      }
      
      const annualRate = monthlyRate * 12;
      // Apply barter upcharge if needed
      return paymentType === 'barter' ? annualRate * 1.35 : annualRate;
    }
  };

  // Get unique owners
  const uniqueOwners = useMemo(() => {
    if (mediaType === 'TV') {
      return [...new Set(currentStationData.map(s => s["Group Owner"]))].sort();
    } else {
      return [...new Set(currentStationData.map(s => s.owner))].sort();
    }
  }, [currentStationData, mediaType]);

  // Get stations by owner
  const stationsByOwner = useMemo(() => {
    if (!selectedOwner) return [];
    if (mediaType === 'TV') {
      return currentStationData.filter(s => s["Group Owner"] === selectedOwner);
    } else {
      return currentStationData.filter(s => s.owner === selectedOwner);
    }
  }, [selectedOwner, currentStationData, mediaType]);

  // Auto-complete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!stationInput) return [];
    const lastTerm = stationInput.split(',').pop().trim().toUpperCase();
    if (lastTerm.length < 2) return [];
    if (mediaType === 'TV') {
      return currentStationData
        .filter(s => 
          s["Station (ie. WABC-DT WCBS-DT)"].toUpperCase().includes(lastTerm) && 
          !selectedStations.some(sel => sel["Station (ie. WABC-DT WCBS-DT)"] === s["Station (ie. WABC-DT WCBS-DT)"])
        )
        .slice(0, 5);
    } else {
      return currentStationData
        .filter(s => 
          s.station.toUpperCase().includes(lastTerm) && 
          !selectedStations.some(sel => sel.station === s.station)
        )
        .slice(0, 5);
    }
  }, [stationInput, selectedStations, currentStationData, mediaType]);

  // Handle station toggle
  const handleStationToggle = (station) => {
    setSelectedStations(prev => {
      if (mediaType === 'TV') {
        const exists = prev.find(s => s["Station (ie. WABC-DT WCBS-DT)"] === station["Station (ie. WABC-DT WCBS-DT)"]);
        if (exists) {
          return prev.filter(s => s["Station (ie. WABC-DT WCBS-DT)"] !== station["Station (ie. WABC-DT WCBS-DT)"]);
        }
        return [...prev, station];
      } else {
        const exists = prev.find(s => s.station === station.station);
        if (exists) {
          return prev.filter(s => s.station !== station.station);
        }
        return [...prev, station];
      }
    });
  };

  // Handle select all for owner
  const handleSelectAllOwner = () => {
    if (mediaType === 'TV') {
      if (stationsByOwner.every(s => selectedStations.some(sel => sel["Station (ie. WABC-DT WCBS-DT)"] === s["Station (ie. WABC-DT WCBS-DT)"]))) {
        setSelectedStations(prev => 
          prev.filter(s => !stationsByOwner.some(so => so["Station (ie. WABC-DT WCBS-DT)"] === s["Station (ie. WABC-DT WCBS-DT)"]))
        );
      } else {
        const newStations = stationsByOwner.filter(s => 
          !selectedStations.some(sel => sel["Station (ie. WABC-DT WCBS-DT)"] === s["Station (ie. WABC-DT WCBS-DT)"])
        );
        setSelectedStations(prev => [...prev, ...newStations]);
      }
    } else {
      if (stationsByOwner.every(s => selectedStations.some(sel => sel.station === s.station))) {
        setSelectedStations(prev => 
          prev.filter(s => !stationsByOwner.some(so => so.station === s.station))
        );
      } else {
        const newStations = stationsByOwner.filter(s => 
          !selectedStations.some(sel => sel.station === s.station)
        );
        setSelectedStations(prev => [...prev, ...newStations]);
      }
    }
  };

  // Handle manual station input
  const handleStationInputSubmit = () => {
    const stationNames = stationInput.split(',').map(s => s.trim().toUpperCase()).filter(s => s);
    let foundStations = [];
    if (mediaType === 'TV') {
      foundStations = currentStationData.filter(station => 
        stationNames.includes(station["Station (ie. WABC-DT WCBS-DT)"].toUpperCase()) &&
        !selectedStations.some(sel => sel["Station (ie. WABC-DT WCBS-DT)"] === station["Station (ie. WABC-DT WCBS-DT)"])
      );
    } else {
      foundStations = currentStationData.filter(station => 
        stationNames.includes(station.station.toUpperCase()) &&
        !selectedStations.some(sel => sel.station === station.station)
      );
    }
    if (foundStations.length > 0) {
      setSelectedStations(prev => [...prev, ...foundStations]);
      setStationInput('');
    }
  };

  // Handle autocomplete selection
  const handleAutocompleteSelect = (station) => {
    setSelectedStations(prev => [...prev, station]);
    setStationInput('');
    setShowAutocomplete(false);
  };

  // Handle product toggle
  const handleProductToggle = (product) => {
    setSelectedProducts(prev => {
      if (prev.includes(product)) {
        return prev.filter(p => p !== product);
      }
      return [...prev, product];
    });
  };

  // Calculate line items
  const calculateLineItems = () => {
    const lineItems = [];
    const toplineProduct = mediaType === 'TV' ? "TopLine-TV" : "TopLine";
    
    selectedStations.forEach(station => {
      selectedProducts.forEach(product => {
        const rate = getRate(station, product, product === toplineProduct ? parseInt(toplineUsers) : null);
        lineItems.push({
          station: mediaType === 'TV' ? (station["Station (ie. WABC-DT WCBS-DT)"] || station.station) : station.station,
          product,
          rank: mediaType === 'TV' ? station.msaRankTV : station.primeAQH,
          value: rate,
          toplineUsers: product === toplineProduct ? parseInt(toplineUsers) : null,
          market: mediaType === 'TV' ? station.dma : station.market
        });
      });
    });
    return lineItems;
  };

  // Add variation to contract
  const addToContract = () => {
    if (selectedStations.length === 0 || selectedProducts.length === 0) {
      alert('Please select at least one station and one product');
      return;
    }

    // Validate TopLine users if TopLine is selected
    const toplineProduct = mediaType === 'TV' ? "TopLine-TV" : "TopLine";
    if (selectedProducts.includes(toplineProduct) && (!toplineUsers || parseInt(toplineUsers) <= 0)) {
      alert('Please enter the number of TopLine users');
      return;
    }

    const lineItems = calculateLineItems();
    const totalValue = lineItems.reduce((sum, item) => sum + item.value, 0);

    const variation = {
      id: Date.now(),
      mediaType,
      paymentType: mediaType === 'Radio' ? paymentType : 'cash',
      stations: [...selectedStations],
      products: [...selectedProducts],
      lineItems,
      totalValue,
      date: contractDate,
      toplineUsers: selectedProducts.includes(mediaType === 'TV' ? "TopLine-TV" : "TopLine") ? parseInt(toplineUsers) : null,
      barterMinutes: mediaType === 'Radio' && paymentType === 'barter' ? { ...barterMinutes } : null
    };

    setContractVariations(prev => [...prev, variation]);
    
    // Reset form for next variation
    setSelectedStations([]);
    setSelectedProducts([]);
    setToplineUsers('');
    setBarterMinutes({});
  };

  // Remove variation
  const removeVariation = (id) => {
    setContractVariations(prev => prev.filter(v => v.id !== id));
  };

  // Generate final contract
  const generateContract = () => {
    if (contractVariations.length === 0) {
      alert('Please add at least one variation to the contract');
      return;
    }
    setShowFinalContract(true);
  };

  // Edit contract - go back to form with preserved data
  const editContract = () => {
    setShowFinalContract(false);
    // Contract variations are already preserved in state
  };

  // Email contract
  const emailContract = () => {
    const customerName = contractVariations[0]?.stations[0]?.owner || 'Customer';
    const mediaTypes = [...new Set(contractVariations.map(v => v.mediaType))].join(' & ');
    const subject = `${mediaTypes} Service Agreement for Review - ${customerName} - ${new Date(contractDate).toLocaleDateString()}`;
    
    // Create summary for email body (avoiding length limits)
    const totalValue = contractVariations.reduce((sum, v) => sum + v.totalValue, 0);
    const totalStations = contractVariations.reduce((sum, v) => sum + v.stations.length, 0);
    
    const body = `Dear Dan,

Please review the ${mediaTypes} Service Agreement for:

Customer: ${customerName}
Contract Start Date: ${new Date(contractDate).toLocaleDateString()}
Contract Term: ${contractTerm} months
Total Stations: ${totalStations}
Total Annual Value: $${totalValue.toLocaleString()}

Please download the full contract document for complete details.

Best regards,
[Your Name]`;
    
    // Create mailto link with shorter content
    const mailtoLink = `mailto:danwise@futurimedia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.open(mailtoLink, '_blank');
    } catch (error) {
      // Fallback: copy email content to clipboard
      navigator.clipboard.writeText(`${subject}\n\n${body}`).then(() => {
        alert('Email content copied to clipboard. Please paste into your email client.');
      }).catch(() => {
        alert('Unable to open email client. Please manually create email to danwise@futurimedia.com');
      });
    }
  };

  // PDF function - clipboard copy in artifacts, direct download when published  
  const downloadContractPDF = () => {
    try {
      const contractElement = document.getElementById('final-contract-content');
      if (!contractElement) {
        alert('Contract content not found. Please generate a contract first.');
        return;
      }

      // In Claude.ai artifacts, all downloads trigger security popups
      // So we'll copy formatted content to clipboard instead
      const isArtifactEnvironment = window.location.href.includes('claude') || window.location.href.includes('anthropic');
      
      if (isArtifactEnvironment) {
        // Artifact environment: Copy formatted content for manual PDF creation
        copyFormattedForPDF();
      } else {
        // Published app: Direct PDF download
        downloadPDFDirect();
      }
      
    } catch (error) {
      console.error('PDF process failed:', error);
      alert('❌ PDF process failed. Please manually copy the contract text and format in Word, then save as PDF.');
    }
  };

  // Copy formatted content optimized for PDF creation
  const copyFormattedForPDF = () => {
    const contractElement = document.getElementById('final-contract-content');
    const contractText = contractElement.innerText || contractElement.textContent || '';
    
    // Generate filename suggestion
    const customerName = contractVariations[0]?.stations[0]?.owner || 'Customer';
    const cleanName = customerName.split(',')[0].trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    const dateStr = new Date(contractDate).toISOString().split('T')[0];
    const suggestedFilename = `Service-Agreement-${cleanName}-${dateStr}`;
    
    // Create formatted content for Word/PDF
    const formattedContent = `SERVICE AGREEMENT

This Service Agreement and all proposals, statements of work, purchase orders, exhibits, amendments, and any other document ancillary to or made a part of this Service Agreement (collectively, the "Service Agreement"), together with the General Terms and Conditions set forth at https://futurimedia.com/terms-and-conditions/ (the "Terms and Conditions"), is entered into as of ${new Date().toLocaleDateString()} by and between FUTURI MEDIA, LLC, an Ohio limited liability company, together with its affiliated entities (collectively, "Futuri"), and the undersigned individual or entity, together with such entity's owners, managers, directors, officers, employees, contractors, representatives, and assigns (collectively, the "Customer"). Futuri and Customer agree as follows:

${contractText}

---
Generated on ${new Date().toLocaleDateString()} by Futuri Contract Generator`;

    navigator.clipboard.writeText(formattedContent).then(() => {
      alert(`📋 Contract copied for PDF creation!\n\n🔄 Next steps:\n1. Open Microsoft Word or Google Docs\n2. Press Ctrl+V (or Cmd+V) to paste\n3. Format as needed (Times New Roman, 12pt)\n4. File → Save As → PDF\n5. Save as: ${suggestedFilename}.pdf\n\n💡 Content is ready to paste and convert to PDF!`);
    }).catch(() => {
      alert(`📋 Copy failed. Manual steps:\n\n1. Select all contract text above\n2. Copy (Ctrl+C)\n3. Paste into Word\n4. Save as PDF\n\nFilename: ${suggestedFilename}.pdf`);
    });
  };

  // Direct PDF download for published apps (using jsPDF when available)
  const downloadPDFDirect = () => {
    try {
      // This will work when jsPDF is available in published version
      if (typeof window.jsPDF !== 'undefined') {
        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF();
        
        // Get contract text
        const contractElement = document.getElementById('final-contract-content');
        const contractText = contractElement.innerText || contractElement.textContent || '';
        
        // Add text to PDF (basic version - can be enhanced)
        const splitText = doc.splitTextToSize(contractText, 180);
        doc.text(splitText, 20, 20);
        
        // Generate filename
        const customerName = contractVariations[0]?.stations[0]?.owner || 'Customer';
        const cleanName = customerName.split(',')[0].trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
        const dateStr = new Date(contractDate).toISOString().split('T')[0];
        
        doc.save(`Service-Agreement-${cleanName}-${dateStr}.pdf`);
      } else {
        // Fallback to print dialog
        window.print();
      }
    } catch (error) {
      console.error('Direct PDF failed:', error);
      window.print(); // Fallback
    }
  };

  // Simple help for download options
  const showDownloadHelp = () => {
    alert('📄 Download Options:\n\n🔵 BLUE WORD BUTTON (Recommended):\n✅ Downloads a .doc file\n✅ Opens directly in Microsoft Word\n✅ Fully editable\n✅ Can be saved as PDF from Word\n✅ Professional formatting maintained\n\n🔴 RED PRINT PDF BUTTON:\n✅ Opens new window for printing\n✅ Use browser\'s "Print to PDF" feature\n✅ Works in all browsers\n✅ No external libraries needed\n\n💡 Pro Tip: The WORD button is the most reliable and professional option!');
  };

  // Word download function - works in published apps, copies in artifacts
  const downloadContract = () => {
    try {
      const contractElement = document.getElementById('final-contract-content');
      if (!contractElement) {
        alert('Contract content not found. Please generate a contract first.');
        return;
      }

      // Check if we're in Claude.ai artifacts (limited environment)
      const isArtifactEnvironment = window.location.href.includes('claude') || window.location.href.includes('anthropic');
      
      if (isArtifactEnvironment) {
        // Artifact environment: Copy to clipboard
        copyContractToClipboard();
      } else {
        // Published app: Direct download
        downloadWordDirect();
      }
      
    } catch (error) {
      console.error('Download/copy failed:', error);
      alert('❌ Failed to process contract. Please manually copy the text from the screen above.');
    }
  };

  // Copy to clipboard for artifact environment
  const copyContractToClipboard = () => {
    const contractElement = document.getElementById('final-contract-content');
    const customerName = contractVariations[0]?.stations[0]?.owner || 'Customer';
    const mediaTypes = [...new Set(contractVariations.map(v => v.mediaType))].join('-');
    const cleanCustomerName = customerName.split(',')[0].trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    const dateStr = new Date(contractDate).toISOString().split('T')[0];
    const suggestedFilename = `${mediaTypes}-Service-Agreement-${cleanCustomerName}-${dateStr}`;
    
    const contractText = contractElement.innerText || contractElement.textContent || '';
    
    const wordContent = `SERVICE AGREEMENT

This Service Agreement and all proposals, statements of work, purchase orders, exhibits, amendments, and any other document ancillary to or made a part of this Service Agreement (collectively, the "Service Agreement"), together with the General Terms and Conditions set forth at https://futurimedia.com/terms-and-conditions/ (the "Terms and Conditions"), is entered into as of ${new Date().toLocaleDateString()} by and between FUTURI MEDIA, LLC, an Ohio limited liability company, together with its affiliated entities (collectively, "Futuri"), and the undersigned individual or entity, together with such entity's owners, managers, directors, officers, employees, contractors, representatives, and assigns (collectively, the "Customer"). Futuri and Customer agree as follows:

${contractText}

---
Generated on ${new Date().toLocaleDateString()} by Futuri Contract Generator`;

    navigator.clipboard.writeText(wordContent).then(() => {
      alert(`✅ Contract copied to clipboard!\n\n📋 Next steps:\n1. Open Microsoft Word or Google Docs\n2. Press Ctrl+V (or Cmd+V on Mac) to paste\n3. Save as: ${suggestedFilename}.docx\n4. Format as needed\n\n💡 Content is ready to paste!`);
    }).catch(() => {
      const shortContent = contractText.length > 500 ? contractText.substring(0, 500) + '...' : contractText;
      alert(`📋 Automatic clipboard copy failed.\n\nPlease manually copy the contract content.\n\nSuggested filename: ${suggestedFilename}.docx\n\nPreview:\n${shortContent}`);
    });
  };

  // Direct Word download for published apps
  const downloadWordDirect = () => {
    try {
      const contractElement = document.getElementById('final-contract-content');
      const contractText = contractElement.innerText || contractElement.textContent || '';
      
      // Generate filename
      const customerName = contractVariations[0]?.stations[0]?.owner || 'Customer';
      const mediaTypes = [...new Set(contractVariations.map(v => v.mediaType))].join('-');
      const cleanCustomerName = customerName.split(',')[0].trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
      const dateStr = new Date(contractDate).toISOString().split('T')[0];
      const filename = `${mediaTypes}-Service-Agreement-${cleanCustomerName}-${dateStr}.docx`;
      
      // Create proper Word document content
      const wordContent = `SERVICE AGREEMENT

This Service Agreement and all proposals, statements of work, purchase orders, exhibits, amendments, and any other document ancillary to or made a part of this Service Agreement (collectively, the "Service Agreement"), together with the General Terms and Conditions set forth at https://futurimedia.com/terms-and-conditions/ (the "Terms and Conditions"), is entered into as of ${new Date().toLocaleDateString()} by and between FUTURI MEDIA, LLC, an Ohio limited liability company, together with its affiliated entities (collectively, "Futuri"), and the undersigned individual or entity, together with such entity's owners, managers, directors, officers, employees, contractors, representatives, and assigns (collectively, the "Customer"). Futuri and Customer agree as follows:

${contractText}

---
Generated on ${new Date().toLocaleDateString()} by Futuri Contract Generator`;

      // Create blob and download
      const blob = new Blob([wordContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      URL.revokeObjectURL(url);
      
      alert(`✅ Word document downloaded!\n\nFile: ${filename}\n\n📄 Check your Downloads folder`);
      
    } catch (error) {
      console.error('Word download failed:', error);
      // Fallback to clipboard
      copyContractToClipboard();
    }
  };

  // Reset everything
  const resetAll = () => {
    setMediaType(null);
    setPaymentType('cash');
    setStationInput('');
    setSelectedOwner('');
    setSelectedStations([]);
    setSelectedProducts([]);
    setContractDate(new Date().toISOString().split('T')[0]);
    setContractTerm('12');
    setAutoRenewal(false);
    setContractVariations([]);
    setShowFinalContract(false);
    setToplineUsers('');
    setBarterMinutes({});
  };

  // Media Type Selection Screen
  if (!mediaType) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
            <FileText className="w-8 h-8" />
            Contract Generator
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6 text-center">Select Media Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMediaType('TV')}
                className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex flex-col items-center gap-3"
              >
                <Tv className="w-12 h-12 text-blue-600" />
                <span className="font-semibold text-blue-900">TV</span>
                <span className="text-sm text-gray-600">MSA Rank Based</span>
              </button>
              
              <button
                onClick={() => setMediaType('Radio')}
                className="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex flex-col items-center gap-3"
              >
                <Radio className="w-12 h-12 text-green-600" />
                <span className="font-semibold text-green-900">Radio</span>
                <span className="text-sm text-gray-600">AQH Based</span>
              </button>
              
              <button
                onClick={() => alert('Other functionality coming soon')}
                className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center gap-3"
              >
                <MoreHorizontal className="w-12 h-12 text-gray-400" />
                <span className="font-semibold text-gray-400">Other</span>
                <span className="text-sm text-gray-400">Coming Soon</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contract Generator
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {mediaType === 'TV' ? <Tv className="w-8 h-8" /> : <Radio className="w-8 h-8" />}
            {mediaType} Contract Generator
          </h1>
          <button
            onClick={resetAll}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Media Selection
          </button>
        </div>

        {!showFinalContract ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Add Contract Variation
                </h2>
                
                {/* Payment Type Selection for Radio */}
                {mediaType === 'Radio' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-2"
                          checked={paymentType === 'cash'}
                          onChange={() => setPaymentType('cash')}
                        />
                        <span className="text-sm font-medium">Cash</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-2"
                          checked={paymentType === 'barter'}
                          onChange={() => setPaymentType('barter')}
                        />
                        <span className="text-sm font-medium">Barter (+35%)</span>
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Station Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mediaType === 'TV' ? 'Parent (Owner) Selection' : 'Station Selection'}
                  </label>
                  {tvLoading && mediaType === 'TV' ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <p className="mt-2 text-sm text-gray-600">Loading TV stations...</p>
                    </div>
                  ) : (
                    <>
                      {tvError && mediaType === 'TV' && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800">{tvError}</p>
                        </div>
                      )}
                      {/* TV Parent (Owner) Selection */}
                      {mediaType === 'TV' && (
                        <div className="mb-3">
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedOwner}
                            onChange={e => {
                              setSelectedOwner(e.target.value);
                              setSelectedMarket('');
                              setSelectedStations([]);
                            }}
                          >
                            <option value="">Select Parent (Owner)...</option>
                            {[...new Set(tvStations.map(s => s["Group Owner"]))].filter(Boolean).sort().map(owner => (
                              <option key={owner} value={owner}>{owner}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {/* TV Market (DMA) Selection */}
                      {mediaType === 'TV' && selectedOwner && (
                        <div className="mb-3">
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedMarket}
                            onChange={e => {
                              setSelectedMarket(e.target.value);
                              setSelectedStations([]);
                            }}
                          >
                            <option value="ALL">All Markets</option>
                            {[...new Set(tvStations.filter(s => s["Group Owner"] === selectedOwner).map(s => s["Nielsen DMA"]))].filter(Boolean).sort().map(dma => (
                              <option key={dma} value={dma}>{dma}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {/* TV Station Checkboxes (filtered by parent and market) */}
                      {mediaType === 'TV' && selectedOwner && (
                        <div className="mt-2 p-3 bg-gray-50 rounded max-h-48 overflow-y-auto">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">Stations for {selectedOwner}{selectedMarket && selectedMarket !== 'ALL' ? ` in ${selectedMarket}` : ''}:</p>
                            <button
                              onClick={() => {
                                const stations = tvStations.filter(s => s["Group Owner"] === selectedOwner && (!selectedMarket || selectedMarket === 'ALL' || s["Nielsen DMA"] === selectedMarket));
                                if (stations.every(s => selectedStations.some(sel => sel["Station (ie. WABC-DT WCBS-DT)"] === s["Station (ie. WABC-DT WCBS-DT)"]))) {
                                  setSelectedStations(prev => prev.filter(s => !stations.some(so => so["Station (ie. WABC-DT WCBS-DT)"] === s["Station (ie. WABC-DT WCBS-DT)"])));
                                } else {
                                  const newStations = stations.filter(s => !selectedStations.some(sel => sel["Station (ie. WABC-DT WCBS-DT)"] === s["Station (ie. WABC-DT WCBS-DT)"]));
                                  setSelectedStations(prev => [...prev, ...newStations]);
                                }
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {tvStations.filter(s => s["Group Owner"] === selectedOwner && (!selectedMarket || selectedMarket === 'ALL' || s["Nielsen DMA"] === selectedMarket)).every(s => selectedStations.some(sel => sel["Station (ie. WABC-DT WCBS-DT)"] === s["Station (ie. WABC-DT WCBS-DT)"]))
                                ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                          {tvStations.filter(s => s["Group Owner"] === selectedOwner && (!selectedMarket || selectedMarket === 'ALL' || s["Nielsen DMA"] === selectedMarket)).map(station => (
                            <label key={station["Station (ie. WABC-DT WCBS-DT)"]} className="flex items-center p-1 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedStations.some(s => s["Station (ie. WABC-DT WCBS-DT)"] === station["Station (ie. WABC-DT WCBS-DT)"])}
                                onChange={() => {
                                  const exists = selectedStations.some(s => s["Station (ie. WABC-DT WCBS-DT)"] === station["Station (ie. WABC-DT WCBS-DT)"]);
                                  if (exists) {
                                    setSelectedStations(prev => prev.filter(s => s["Station (ie. WABC-DT WCBS-DT)"] !== station["Station (ie. WABC-DT WCBS-DT)"]));
                                  } else {
                                    setSelectedStations(prev => [...prev, station]);
                                  }
                                }}
                              />
                              <span className="text-sm">
                                {(station["Station (ie. WABC-DT WCBS-DT)"] || station.station)} - {station["Nielsen DMA"]} (Rank: {station.msaRankTV || station["Nielsen Rank"] || "N/A"})
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                      {/* RADIO OWNER, MARKET, AND STATION SELECTION */}
                      {mediaType === 'Radio' && (
                        <>
                          {/* Radio Owner Dropdown */}
                          <div className="mb-3">
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={selectedRadioOwner}
                              onChange={e => {
                                setSelectedRadioOwner(e.target.value);
                                setSelectedRadioMarket('');
                                setSelectedStations([]);
                              }}
                            >
                              <option value="">Select Owner...</option>
                              {radioOwners.map(owner => (
                                <option key={owner} value={owner}>{owner}</option>
                              ))}
                            </select>
                          </div>
                          {/* Radio Market Dropdown */}
                          {selectedRadioOwner && (
                            <div className="mb-3">
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedRadioMarket}
                                onChange={e => {
                                  setSelectedRadioMarket(e.target.value);
                                  setSelectedStations([]);
                                }}
                              >
                                <option value="ALL">All Markets</option>
                                {radioMarkets.map(market => (
                                  <option key={market} value={market}>{market}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          {/* Radio Station Multi-Select */}
                          {selectedRadioOwner && (
                            <div className="mt-2 p-3 bg-gray-50 rounded max-h-48 overflow-y-auto">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-sm">Stations for {selectedRadioOwner}{selectedRadioMarket && selectedRadioMarket !== 'ALL' ? ` in ${selectedRadioMarket}` : ''}:</p>
                                <button
                                  onClick={() => {
                                    const stations = radioStationsByOwnerMarket;
                                    if (stations.every(s => selectedStations.some(sel => sel.station === s.station))) {
                                      setSelectedStations(prev => prev.filter(s => !stations.some(so => so.station === s.station)));
                                    } else {
                                      const newStations = stations.filter(s => !selectedStations.some(sel => sel.station === s.station));
                                      setSelectedStations(prev => [...prev, ...newStations]);
                                    }
                                  }}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                  {radioStationsByOwnerMarket.every(s => selectedStations.some(sel => sel.station === s.station))
                                    ? 'Deselect All' : 'Select All'}
                                </button>
                              </div>
                              {radioStationsByOwnerMarket.map(station => (
                                <label key={station.station} className="flex items-center p-1 hover:bg-gray-100 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedStations.some(s => s.station === station.station)}
                                    onChange={() => {
                                      const exists = selectedStations.some(s => s.station === station.station);
                                      if (exists) {
                                        setSelectedStations(prev => prev.filter(s => s.station !== station.station));
                                      } else {
                                        setSelectedStations(prev => [...prev, station]);
                                      }
                                    }}
                                  />
                                  <span className="text-sm">
                                    {station.station} - {station.market} (AQH: {station.primeAQH?.toLocaleString?.() ?? ''})
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Selected Stations Display (unchanged) */}
                  {selectedStations.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Selected Stations ({selectedStations.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedStations.map(station => (
                          <span
                            key={mediaType === 'TV' ? station["Station (ie. WABC-DT WCBS-DT)"] : station.station}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                          >
                            {mediaType === 'TV'
                              ? `${station["Station (ie. WABC-DT WCBS-DT)"]} (Rank: ${station["Nielsen Rank"]})`
                              : `${station.station} (AQH: ${station.primeAQH?.toLocaleString?.() ?? ''})`
                            }
                            <button
                              onClick={() => handleStationToggle(station)}
                              className="hover:text-blue-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* TopLine Users Input */}
                {(selectedProducts.includes("TopLine-TV") || selectedProducts.includes("TopLine")) && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of TopLine Users
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter number of TopLine users"
                      value={toplineUsers}
                      onChange={(e) => setToplineUsers(e.target.value)}
                    />
                  </div>
                )}

                {/* Products */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mediaType} Products
                  </label>
                  <div className="space-y-2 border border-gray-200 rounded-md p-3 max-h-64 overflow-y-auto">
                    {currentProducts.map(product => (
                      <label key={product} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded">
                        <input
                          type="checkbox"
                          className="mr-3"
                          checked={selectedProducts.includes(product)}
                          onChange={() => handleProductToggle(product)}
                        />
                        <span className="text-sm font-medium">{product}</span>
                      </label>
                    ))}
                  </div>
                  {selectedProducts.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedProducts.length} product(s) selected
                    </p>
                  )}
                </div>

                {/* Line Items Preview */}
                {selectedStations.length > 0 && selectedProducts.length > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-semibold mb-2">
                      Line Items Preview (Annual Rates{mediaType === 'Radio' && paymentType === 'barter' ? ' - Barter +35%' : ''})
                    </h3>
                    <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
                      {calculateLineItems().map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between">
                            <span>{(item["station"] || item["Station (ie. WABC-DT WCBS-DT)"])} - {item.product}</span>
                            <span className="font-medium">${item.value.toLocaleString()}</span>
                          </div>
                          {(item.product === "TopLine-TV" || item.product === "TopLine") && item.toplineUsers && (
                            <div className="text-xs text-gray-500 ml-4">
                              ({item.toplineUsers} users × $95 × 3{mediaType === 'TV' ? ' + $3,000' : ''})
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-gray-300 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${calculateLineItems().reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Barter Minutes Calculator for Radio */}
                {mediaType === 'Radio' && paymentType === 'barter' && selectedStations.length > 0 && selectedProducts.length > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <span>🎯</span>
                      Barter Minutes Calculator - Optimal Distribution
                    </h3>
                    
                    {(() => {
                      const totalBarterValue = calculateLineItems().reduce((sum, item) => sum + item.value, 0);
                      const optimalMinutes = calculateOptimalBarterMinutes(selectedStations, totalBarterValue);
                      
                      // Auto-set optimal minutes if not already set or if stations/products changed
                      const currentMinutes = Object.keys(barterMinutes).length === 0 ? optimalMinutes : barterMinutes;
                      if (Object.keys(barterMinutes).length === 0) {
                        setBarterMinutes(optimalMinutes);
                      }
                      
                      const currentValue = calculateBarterValueFromMinutes(selectedStations, currentMinutes);
                      const optimalValue = calculateBarterValueFromMinutes(selectedStations, optimalMinutes);
                      const totalOptimalMinutes = Object.values(optimalMinutes).reduce((sum, station) => sum + station.prime + station.ros, 0);
                      
                      return (
                        <div>
                          <div className="mb-4 p-3 bg-white rounded border">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Target Barter Value:</span>
                              <span className="font-bold text-lg">${totalBarterValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Current Minutes Value:</span>
                              <span className={`font-bold ${Math.abs(currentValue - totalBarterValue) < 1000 ? 'text-green-600' : Math.abs(currentValue - totalBarterValue) < 5000 ? 'text-orange-600' : 'text-red-600'}`}>
                                ${currentValue.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Variance from Target:</span>
                              <span className={`font-bold ${Math.abs(currentValue - totalBarterValue) < 1000 ? 'text-green-600' : currentValue > totalBarterValue ? 'text-blue-600' : 'text-red-600'}`}>
                                ${(currentValue - totalBarterValue).toLocaleString()} 
                                <span className="text-xs ml-1">
                                  ({((currentValue - totalBarterValue) / totalBarterValue * 100).toFixed(1)}%)
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="mb-3 flex gap-2">
                            <button
                              onClick={() => setBarterMinutes(optimalMinutes)}
                              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                            >
                              Reset to Optimal
                            </button>
                            <div className="text-xs text-gray-500 flex items-center">
                              💡 Optimal = Minimal total daily minutes across ALL selected stations to hit annual target exactly
                            </div>
                          </div>

                          <div className="space-y-3">
                            {selectedStations.map(station => {
                              const stationMinutes = currentMinutes[station.station] || { prime: 0, ros: 0 };
                              const optimalStationMinutes = optimalMinutes[station.station] || { prime: 0, ros: 0 };
                              const primeValue = calculateMinuteValue(station, 'prime');
                              const rosValue = calculateMinuteValue(station, 'ros');
                              const stationTotal = (primeValue * stationMinutes.prime) + (rosValue * stationMinutes.ros);
                              const isOptimal = stationMinutes.prime === optimalStationMinutes.prime && stationMinutes.ros === optimalStationMinutes.ros;
                              
                              return (
                                <div key={station.station} className={`bg-white p-3 rounded border ${isOptimal ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{station.station}</span>
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600">
                                        Prime AQH: {station.primeAQH.toLocaleString()} | ROS AQH: {station.rosAQH.toLocaleString()}
                                      </div>
                                      {isOptimal && <div className="text-xs text-green-600 font-medium">✓ Optimal</div>}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Prime Minutes/Day (${Math.round(calculateMinuteValue(station, 'prime')).toLocaleString()}/min daily)
                                        {optimalStationMinutes.prime > 0 && (
                                          <span className="ml-1 text-blue-600 font-medium">
                                            [Optimal: {optimalStationMinutes.prime}]
                                          </span>
                                        )}
                                      </label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={stationMinutes.prime}
                                        onChange={(e) => {
                                          const newMinutes = { ...currentMinutes };
                                          if (!newMinutes[station.station]) newMinutes[station.station] = { prime: 0, ros: 0 };
                                          newMinutes[station.station].prime = Math.max(0, parseFloat(e.target.value) || 0);
                                          setBarterMinutes(newMinutes);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        ROS Minutes/Day (${Math.round(calculateMinuteValue(station, 'ros')).toLocaleString()}/min daily)
                                        {optimalStationMinutes.ros > 0 && (
                                          <span className="ml-1 text-blue-600 font-medium">
                                            [Optimal: {optimalStationMinutes.ros}]
                                          </span>
                                        )}
                                      </label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={stationMinutes.ros}
                                        onChange={(e) => {
                                          const newMinutes = { ...currentMinutes };
                                          if (!newMinutes[station.station]) newMinutes[station.station] = { prime: 0, ros: 0 };
                                          newMinutes[station.station].ros = Math.max(0, parseFloat(e.target.value) || 0);
                                          setBarterMinutes(newMinutes);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 text-xs text-gray-600">
                                    Station Value: ${Math.round(stationTotal).toLocaleString()} 
                                    {stationMinutes.prime + stationMinutes.ros > 0 && (
                                      <span className="ml-2">
                                        ({stationMinutes.prime + stationMinutes.ros} min/day total)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-3 text-xs text-gray-500 bg-white p-2 rounded">
                            <p><strong>Optimization Strategy:</strong> Finds absolute minimum daily minutes across ALL selected stations. Uses highest-value slots first (Prime or ROS, any station) until target is reached.</p>
                            <p><strong>Formula:</strong> ((AQH/1000) × CPM × 7 × 2) × 52 weeks | <strong>CPM:</strong> Prime = $2.00, ROS = $1.90</p>
                            <p><strong>Limits:</strong> Max 10 minutes/day per type per station | <strong>Target:</strong> Green = within 1K, Orange = within 5K, Red = over 5K variance</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Contract Date */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={contractDate}
                    onChange={(e) => setContractDate(e.target.value)}
                  />
                </div>

                {/* Contract Term */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Term (months)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={contractTerm === '12' || contractTerm === '24' || contractTerm === '36' ? contractTerm : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setContractTerm(e.target.value);
                      }
                    }}
                  >
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="custom">Custom</option>
                  </select>
                  {(contractTerm !== '12' && contractTerm !== '24' && contractTerm !== '36') && (
                    <input
                      type="number"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter custom term in months"
                      value={contractTerm}
                      onChange={(e) => setContractTerm(e.target.value)}
                    />
                  )}
                </div>

                {/* Auto Renewal */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={autoRenewal}
                      onChange={(e) => setAutoRenewal(e.target.checked)}
                    />
                    <span className="text-sm font-medium text-gray-700">Auto-renewal</span>
                  </label>
                </div>

                <button
                  onClick={addToContract}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add to Contract
                </button>
              </div>
            </div>

            {/* Contract Variations Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Contract Variations ({contractVariations.length})</h3>
                
                {contractVariations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No variations added yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {contractVariations.map((variation, index) => (
                      <div key={variation.id} className="p-3 bg-gray-50 rounded-md relative">
                        <button
                          onClick={() => removeVariation(variation.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <h4 className="font-medium text-sm mb-1">
                          Variation {index + 1} - {variation.mediaType}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {variation.stations.length} station(s), {variation.products.length} product(s)
                        </p>
                        {variation.paymentType && (
                          <p className="text-xs text-gray-600">
                            Payment: {variation.paymentType === 'barter' ? 'Barter (+35%)' : 'Cash'}
                          </p>
                        )}
                        {variation.toplineUsers && (
                          <p className="text-xs text-gray-600">
                            TopLine Users: {variation.toplineUsers}
                          </p>
                        )}
                        {variation.barterMinutes && (
                          <p className="text-xs text-gray-600">
                            Barter Minutes: {Object.values(variation.barterMinutes).reduce((sum, station) => sum + station.prime + station.ros, 0)} min/day total
                          </p>
                        )}
                        <p className="text-xs text-gray-600">
                          Annual Value: ${variation.totalValue.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {contractVariations.length > 0 && (
                  <button
                    onClick={generateContract}
                    className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Generate Final Contract
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Service Agreement</h2>
            
            <div className="bg-white p-2">
              <p className="text-center text-lg font-bold mb-4">SERVICE AGREEMENT</p>
            </div>
            <div id="final-contract-content" className="bg-white p-8 rounded-md mb-6" style={{fontFamily: 'Times New Roman, serif', fontSize: '14px', lineHeight: '1.6'}}>
              <div className="mb-6">
                <p className="mb-4" style={{textAlign: 'justify'}}>
                  This Service Agreement and all proposals, statements of work, purchase orders, exhibits, amendments, and any other document ancillary to or made a part of this Service Agreement (collectively, the "Service Agreement"), together with the General Terms and Conditions set forth at https://futurimedia.com/terms-and-conditions/ (the "Terms and Conditions"), is entered into as of <strong className="underline">{new Date().toLocaleDateString()}</strong> by and between FUTURI MEDIA, LLC, an Ohio limited liability company, together with its affiliated entities (collectively, "Futuri"), and the undersigned individual or entity, together with such entity's owners, managers, directors, officers, employees, contractors, representatives, and assigns (collectively, the "Customer"). Futuri and Customer agree as follows:
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">1. <span className="underline">Services, Pricing, and Payment Terms</span>.</h3>
                <p className="mb-4" style={{textAlign: 'justify'}}>
                  In consideration for timely payment of the prices set forth below (with cash payment or provision of barter services) Futuri hereby grants to Customer, and Customer hereby accepts from Futuri, a limited, non-sublicensable, non-transferable, non-exclusive license to use the following selected systems (in object-code form only); and/or Customer instructs Futuri to perform and Futuri agrees to provide Customer with the following services (the foregoing systems and/or services are collectively referred to herein as the "Services"):
                </p>

                <div className="mb-6 ml-8">
                  <p className="font-bold">Parent Account: {(() => {
                    const allOwners = contractVariations.flatMap(v => v.stations.map(s => s.owner));
                    const uniqueOwners = [...new Set(allOwners)];
                    return uniqueOwners.join(', ');
                  })()}</p>
                  
                  {/* Group variations by media type */}
                  {['TV', 'Radio'].map(type => {
                    const typeVariations = contractVariations.filter(v => v.mediaType === type);
                    if (typeVariations.length === 0) return null;
                    
                    return (
                      <div key={type} className="mb-6">
                        <p className="font-bold mb-2">{type} Services:</p>
                        {typeVariations.map((variation, idx) => (
                          <div key={variation.id} className="mb-4">
                            <p className="font-bold mb-2">
                              Payment {variation.paymentType === 'barter' ? 'Method: BARTER' : 'Currency: CASH - USD'}
                            </p>
                            
                            <table className="w-full border-collapse mb-4">
                              <thead>
                                <tr>
                                  <th className="text-left p-2 border-b-2 border-gray-400">Market</th>
                                  <th className="text-left p-2 border-b-2 border-gray-400">Station</th>
                                  <th className="text-left p-2 border-b-2 border-gray-400">Product</th>
                                  <th className="text-right p-2 border-b-2 border-gray-400">
                                    {variation.paymentType === 'barter' ? 'Barter Terms' : 'Cash Terms'}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {variation.lineItems.map((item, itemIdx) => (
                                  <tr key={`${variation.id}-${itemIdx}`} className="border-b border-gray-300">
                                    <td className="p-2">{item.market}</td>
                                    <td className="p-2"><strong>{item.station}</strong></td>
                                    <td className="p-2">
                                      <strong>{item.product}</strong>
                                      {(item.product === "TopLine-TV" || item.product === "TopLine") && item.toplineUsers && (
                                        <span className="text-xs"> ({item.toplineUsers} users)</span>
                                      )}
                                    </td>
                                    <td className="p-2 text-right">
                                      {variation.paymentType === 'barter' && variation.barterMinutes && variation.barterMinutes[item.station] ? (
                                        <strong>
                                          {(() => {
                                            const minutes = variation.barterMinutes[item.station];
                                            const terms = [];
                                            if (minutes.prime > 0) {
                                              terms.push(`${minutes.prime} min/day M-Sun Prime`);
                                            }
                                            if (minutes.ros > 0) {
                                              terms.push(`${minutes.ros} min/day M-Sun ROS`);
                                            }
                                            return terms.length > 0 ? terms.join(' & ') : 'No minutes allocated';
                                          })()}
                                        </strong>
                                      ) : (
                                        <strong>${item.value.toLocaleString()} Annually</strong>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  <div className="mt-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left p-2 border-b-2 border-gray-400" colSpan="2">DESCRIPTION OF SERVICES INCLUDED</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border-b border-gray-300" colSpan="2">
                            <strong>
                              {[...new Set(contractVariations.map(v => v.mediaType))].join(' and ')} Analytics and Content Services
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-gray-300" colSpan="2">
                            Includes access to all selected products and services as detailed above. Services include real-time analytics, content generation, and performance tracking tools.
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-gray-300">Package:</td>
                          <td className="p-2 border-b border-gray-300">
                            <strong>{[...new Set(contractVariations.map(v => v.mediaType))].join(' & ')} Services Bundle</strong>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-gray-300">Total Stations:</td>
                          <td className="p-2 border-b border-gray-300">
                            <strong>{contractVariations.reduce((sum, v) => sum + v.stations.length, 0)}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6">
                    <p className="font-bold">Special Terms:</p>
                    <p className="mt-2">First year's annual fee is due and payable upon execution of this agreement.</p>
                    {autoRenewal && <p className="mt-2">This agreement will automatically renew for successive {contractTerm}-month terms unless either party provides written notice of non-renewal at least 30 days prior to the end of the current term.</p>}
                    <p className="mt-2">Customer agrees to provide all necessary access and cooperation for implementation of the Services on the stations listed above.</p>
                    
                    {/* Add barter-specific terms if any barter variations exist */}
                    {contractVariations.some(v => v.paymentType === 'barter') && (
                      <>
                        <p className="mt-2">
                          <strong>Barter Terms:</strong> For stations with barter payment, the barter value represents a 35% premium over the standard cash rate. Customer agrees to provide equivalent advertising inventory as specified in separate barter agreements.
                        </p>
                        {contractVariations.filter(v => v.barterMinutes).length > 0 && (
                          <div className="mt-4">
                            <p className="font-bold">Barter Inventory Requirements:</p>
                            {contractVariations.filter(v => v.barterMinutes).map(variation => (
                              <div key={variation.id} className="mt-2 ml-4">
                                <p className="font-medium">{variation.mediaType} Services:</p>
                                {Object.entries(variation.barterMinutes).map(([station, minutes]) => {
                                  if (minutes.prime === 0 && minutes.ros === 0) return null;
                                  return (
                                    <p key={station} className="ml-4 text-sm">
                                      {station}: {minutes.prime > 0 && `${minutes.prime} Prime min/day`}{minutes.prime > 0 && minutes.ros > 0 && ', '}{minutes.ros > 0 && `${minutes.ros} ROS min/day`} (M-Sun)
                                    </p>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Rest of contract sections continue with all the legal terms... */}
              <div className="mb-6">
                <h3 className="font-bold mb-2">2. <span className="underline">Service Terms</span>.</h3>
                <p className="mb-4" style={{textAlign: 'justify'}}>
                  The Terms and Conditions are hereby amended by supplementing and adding the following items. Customer acknowledges that all content and trademarks are provided "AS IS" for Customer's use only and may not be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any purpose without Futuri's express written permission.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">3. <span className="underline">Term</span>.</h3>
                <p style={{textAlign: 'justify'}}>
                  The initial term of this Service Agreement (the "Initial Term") will commence on <strong className="underline">{new Date(contractDate).toLocaleDateString()}</strong> ("Commencement Date") and shall continue for a period of <strong className="underline">{contractTerm} Months</strong> unless terminated earlier in accordance with the provisions of this Service Agreement or the Terms and Conditions.
                </p>
              </div>

              <div className="mt-8 border-t border-gray-400 pt-4">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-1/2 p-4 align-top">
                        <p className="font-bold mb-2">"Customer"</p>
                        <p className="font-bold mb-8">
                          {(() => {
                            const allOwners = contractVariations.flatMap(v => v.stations.map(s => s.owner));
                            const uniqueOwners = [...new Set(allOwners)];
                            return uniqueOwners.join(', ').toUpperCase() || '[CUSTOMER NAME]';
                          })()}
                        </p>
                        <div className="space-y-4">
                          <div>
                            <p className="border-b border-gray-400 h-8 mb-1"></p>
                            <p className="text-xs text-gray-600">By:</p>
                          </div>
                          <div>
                            <p className="border-b border-gray-400 h-6"></p>
                            <p className="text-xs text-gray-600">Name:</p>
                          </div>
                          <div>
                            <p className="border-b border-gray-400 h-6"></p>
                            <p className="text-xs text-gray-600">Title:</p>
                          </div>
                          <div>
                            <p className="border-b border-gray-400 h-6"></p>
                            <p className="text-xs text-gray-600">Date:</p>
                          </div>
                        </div>
                      </td>
                      <td className="w-1/2 p-4 align-top">
                        <p className="font-bold mb-2">"Futuri"</p>
                        <p className="font-bold mb-8">FUTURI MEDIA, LLC</p>
                        <div className="space-y-4">
                          <div>
                            <p className="border-b border-gray-400 h-8 mb-1"></p>
                            <p className="text-xs text-gray-600">By:</p>
                          </div>
                          <div>
                            <p className="border-b border-gray-400 h-6"></p>
                            <p className="text-xs text-gray-600">Name:</p>
                          </div>
                          <div>
                            <p className="border-b border-gray-400 h-6"></p>
                            <p className="text-xs text-gray-600">Title:</p>
                          </div>
                          <div>
                            <p className="border-b border-gray-400 h-6"></p>
                            <p className="text-xs text-gray-600">Date:</p>
                          </div>
                          <div className="mt-8">
                            <p className="text-xs text-gray-600">Email:</p>
                            <p className="text-sm">contracts@futurimedia.com</p>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm">6509 Brecksville Road<br />PO Box 31630<br />Independence, OH 44131</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mb-4">
              📄 Contract ready! In artifacts: Both buttons copy to clipboard. When published: Direct downloads.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <button
                onClick={downloadContract}
                className="bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                title="Copy contract text to clipboard for Word"
              >
                <Download className="w-4 h-4" />
                Word
              </button>
              <button
                onClick={downloadContractPDF}
                data-pdf-button
                className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                title="Copy contract text to clipboard for PDF creation"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={editContract}
                className="bg-orange-600 text-white py-2 px-3 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={emailContract}
                className="bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                onClick={resetAll}
                className="bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                New
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractGenerator;
