import { GetDomElementOuterWidth, SetDomElementOuterHeight, SetDomElementOuterWidth } from '../engine/viewer/domutils.js';
import { PanelSet } from './panelset.js';
import { SidebarDetailsPanel } from './sidebardetailspanel.js';
import { SidebarSettingsPanel } from './sidebarsettingspanel.js';

export class Sidebar
{
    constructor (mainDiv, settings, panelSet)
    {
        this.mainDiv = mainDiv;
        this.panelSet = panelSet || new PanelSet (mainDiv);
        this.isMergedIntoNavigator = Boolean (panelSet);

        this.detailsPanel = new SidebarDetailsPanel (this.panelSet.GetContentDiv ());
        this.settingsPanel = new SidebarSettingsPanel (this.panelSet.GetContentDiv (), settings);

        this.panelSet.AddPanel (this.detailsPanel);
        this.panelSet.AddPanel (this.settingsPanel);
        if (!this.isMergedIntoNavigator) {
            this.panelSet.ShowPanel (this.detailsPanel);
        }
    }

    IsPanelsVisible ()
    {
        if (this.isMergedIntoNavigator) {
            return false;
        }
        return this.panelSet.IsPanelsVisible ();
    }

    ShowPanels (show)
    {
        if (this.isMergedIntoNavigator) {
            return;
        }
        this.panelSet.ShowPanels (show);
    }

    Init (callbacks)
    {
        this.callbacks = callbacks;

        if (!this.isMergedIntoNavigator) {
            this.panelSet.Init ({
                onResizeRequested : () => {
                    this.callbacks.onResizeRequested ();
                },
                onShowHidePanels : (show) => {
                    this.callbacks.onShowHidePanels (show);
                }
            });
        }

        this.settingsPanel.Init ({
            getShadingType : () => {
                return this.callbacks.getShadingType ();
            },
            getProjectionMode : () => {
                return this.callbacks.getProjectionMode ();
            },
            getDefaultMaterials : () => {
                return this.callbacks.getDefaultMaterials ();
            },
            onEnvironmentMapChanged : () => {
                this.callbacks.onEnvironmentMapChanged ();
            },
            onBackgroundColorChanged : () => {
                this.callbacks.onBackgroundColorChanged ();
            },
            onDefaultColorChanged : () => {
                this.callbacks.onDefaultColorChanged ();
            },
            onEdgeDisplayChanged : () => {
                this.callbacks.onEdgeDisplayChanged ();
            }
        });
    }

    UpdateControlsStatus ()
    {
        this.settingsPanel.UpdateControlsStatus ();
    }

    UpdateControlsVisibility ()
    {
        this.settingsPanel.UpdateControlsVisibility ();
    }

    Resize (height)
    {
        if (this.isMergedIntoNavigator) {
            return;
        }
        SetDomElementOuterHeight (this.mainDiv, height);
        this.panelSet.Resize ();
    }

    GetWidth ()
    {
        if (this.isMergedIntoNavigator) {
            return 0;
        }
        return GetDomElementOuterWidth (this.mainDiv);
    }

    SetWidth (width)
    {
        if (this.isMergedIntoNavigator) {
            return;
        }
        SetDomElementOuterWidth (this.mainDiv, width);
    }

    Clear ()
    {
        if (this.isMergedIntoNavigator) {
            return;
        }
        this.panelSet.Clear ();
    }

    AddObject3DProperties (model, object3D)
    {
        this.detailsPanel.AddObject3DProperties (model, object3D);
    }

    AddMaterialProperties (material)
    {
        this.detailsPanel.AddMaterialProperties (material);
    }
}
