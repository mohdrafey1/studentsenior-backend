// whatsappGroup.js
const WhatsappGroup = require('../models/WhatsappGroup');

module.exports = {
    index: async (req, res) => {
        let Groups = await WhatsappGroup.find({}).populate('college');
        res.render('whatsappgroup/index.ejs', { Groups });
    },
    createGroupForm: async (req, res) => {
        res.render('whatsappgroup/new.ejs');
    },
    createGroup: async (req, res) => {
        const { title, info, domain, link, college, status } = req.body;
        const newGroup = new WhatsappGroup({
            title,
            info,
            domain,
            link,
            college,
            status,
        });
        await newGroup.save();
        req.flash('success', 'Group Created Successfully');
        return res.redirect(`/whatsappgroup`);
    },
    editGroupForm: async (req, res) => {
        const { id } = req.params;
        const group = await WhatsappGroup.findById(id);
        if (!group) {
            req.flash('error', 'Group not found!');
            return res.redirect(`/whatsappgroup`);
        }
        res.render('whatsappgroup/edit', { group });
    },
    editGroup: async (req, res) => {
        try {
            const { id } = req.params;
            let { college, title, info, domain, link, status } = req.body;

            const updateData = {
                college,
                title,
                info,
                domain,
                link,
                status: status === 'true',
            };

            const updatedGroup = await WhatsappGroup.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                }
            );

            if (!updatedGroup) {
                req.flash('error', 'PYQ not found');
                return res.redirect('/whatsappgroup');
            }

            req.flash('success', 'Updated Successfully');
            res.redirect(`/whatsappgroup`);
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error updating PYQ');
            res.redirect(`/whatsappgroup/${id}/edit`);
        }
    },
    deleteGroup: async (req, res) => {
        await WhatsappGroup.findByIdAndDelete(req.params.id);
        res.redirect(`/whatsappgroup`);
    },
};
