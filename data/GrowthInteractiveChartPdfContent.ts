export function generateGrowthInteractiveChartPdf({ isDarkMode = false, appIconBase64 = "", chartImageBase64 = "", currentDate = "", currentTime = "" }: {
    isDarkMode?: boolean,
    appIconBase64?: string,
    currentDate?: string
    currentTime?: string,
    chartImageBase64?: string
}) {



    return `
    
    <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Croissance - Malnutrix</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
            color: ${isDarkMode ? '#ffffff' : '#333333'};
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: ${isDarkMode ? '#2d2d2d' : '#ffffff'};
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid ${isDarkMode ? '#444444' : '#e0e0e0'};
        }

        .app-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .app-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .app-name {
            font-size: 28px;
            font-weight: bold;
            color: ${isDarkMode ? '#4ade80' : '#16a34a'};
        }

        .report-info {
            text-align: right;
            font-size: 14px;
            color: ${isDarkMode ? '#888888' : '#666666'};
        }

        .patient-info {
            background-color: ${isDarkMode ? '#3a3a3a' : '#f8f9fa'};
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid ${isDarkMode ? '#4ade80' : '#16a34a'};
        }

        .patient-info h2 {
            color: ${isDarkMode ? '#4ade80' : '#16a34a'};
            margin-bottom: 15px;
            font-size: 20px;
        }

        .patient-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid ${isDarkMode ? '#555555' : '#e0e0e0'};
        }

        .detail-label {
            font-weight: bold;
            color: ${isDarkMode ? '#cccccc' : '#555555'};
        }

        .detail-value {
            color: ${isDarkMode ? '#ffffff' : '#333333'};
        }

        .chart-section {
            margin: 30px 0;
        }

        .chart-title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 20px;
            color: ${isDarkMode ? '#4ade80' : '#16a34a'};
        }

        .chart-container {
            text-align: center;
            margin-bottom: 25px;
            background-color: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
            padding: 20px;
            border-radius: 8px;
            border: 1px solid ${isDarkMode ? '#444444' : '#e0e0e0'};
        }

        .chart-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});
        }

        .legend {
            background-color: ${isDarkMode ? '#3a3a3a' : '#f8f9fa'};
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .legend-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: ${isDarkMode ? '#4ade80' : '#16a34a'};
            text-align: center;
        }

        .legend-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background-color: ${isDarkMode ? '#2d2d2d' : '#ffffff'};
            border-radius: 6px;
            border: 1px solid ${isDarkMode ? '#555555' : '#e0e0e0'};
        }

        .legend-color {
            width: 20px;
            height: 3px;
            border-radius: 2px;
        }

        .legend-text {
            font-size: 12px;
            font-weight: 500;
        }

        .interpretation {
            margin-top: 30px;
            padding: 20px;
            background-color: ${isDarkMode ? '#3a3a3a' : '#f0f9ff'};
            border-radius: 8px;
            border-left: 4px solid ${isDarkMode ? '#3b82f6' : '#0ea5e9'};
        }

        .interpretation h3 {
            color: ${isDarkMode ? '#60a5fa' : '#0ea5e9'};
            margin-bottom: 15px;
            font-size: 18px;
        }

        .interpretation-content {
            font-size: 14px;
            line-height: 1.7;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid ${isDarkMode ? '#444444' : '#e0e0e0'};
            text-align: center;
            color: ${isDarkMode ? '#888888' : '#666666'};
            font-size: 12px;
        }

        .measurements-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: ${isDarkMode ? '#2d2d2d' : '#ffffff'};
        }

        .measurements-table th,
        .measurements-table td {
            padding: 12px;
            text-align: center;
            border: 1px solid ${isDarkMode ? '#555555' : '#e0e0e0'};
        }

        .measurements-table th {
            background-color: ${isDarkMode ? '#4ade80' : '#16a34a'};
            color: white;
            font-weight: bold;
        }

        .measurements-table tr:nth-child(even) {
            background-color: ${isDarkMode ? '#3a3a3a' : '#f8f9fa'};
        }

        @media print {
            body {
                background-color: white !important;
                color: black !important;
            }
            .container {
                box-shadow: none !important;
                border: 1px solid #ccc;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête -->
        <div class="header">
            <div class="app-info">
                <img src="${appIconBase64}" alt="Malnutrix Icon" class="app-icon">
                <div class="app-name">Malnutrix</div>
            </div>
            <div class="report-info">
                <div><strong>Rapport généré le:</strong> ${currentDate}</div>
                <div><strong>Heure:</strong> ${currentTime}</div>
            </div>
        </div>

  

        <!-- Section graphique -->
        <div class="chart-section">
            <h2 class="chart-title">Courbe de Croissance - Évolution du Poids</h2>
            <div class="chart-container">
                <img src="${chartImageBase64}" alt="Courbe de croissance" class="chart-image">
            </div>

            <!-- Légende -->
            <div class="legend">
                <div class="legend-title">Légende des Percentiles</div>
                <div class="legend-grid">
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #dc2626;"></div>
                        <span class="legend-text">3e percentile</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #ea580c;"></div>
                        <span class="legend-text">10e percentile</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #eab308;"></div>
                        <span class="legend-text">25e percentile</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #16a34a;"></div>
                        <span class="legend-text">50e percentile</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #06b6d4;"></div>
                        <span class="legend-text">75e percentile</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #3b82f6;"></div>
                        <span class="legend-text">90e percentile</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #8b5cf6;"></div>
                        <span class="legend-text">97e percentile</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: #ec4899;"></div>
                        <span class="legend-text">Données patient</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tableau des mesures récentes -->
      
        <!-- Pied de page -->
        <div class="footer">
            <div><strong>Malnutrix</strong> - Application de suivi nutritionnel</div>
            <div>Ce rapport a été généré automatiquement. Consultez un professionnel de santé pour toute question médicale.</div>
            <div style="margin-top: 10px;">© ${new Date().getFullYear()} Malnutrix. Tous droits réservés.</div>
        </div>
    </div>
</body>
</html>
    
    `
}